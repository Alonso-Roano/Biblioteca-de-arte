import { defineStore } from "pinia";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import type { AxiosResponse } from "axios";
import type User from "../interfaces/User";
import endpoints from "@/api/endpoints";
import { apiRequest } from "@/api/apiClient";

interface AuthState {
  status: "unauthorized" | "pending" | "authorized";
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    status: "unauthorized",
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    user: null,
  }),

  actions: {
    isTokenExpired(token: string): boolean {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); 
        return decoded.exp < currentTime;
      } catch (e) {
        console.error("Error al decodificar el token", e);
        return true;
      }
    },

    async initializeAuth() {
      const token = this.token || localStorage.getItem("token");
      if (token) {
        this.status = "authorized";
        this.setUserFromToken(token); 
      } else {
        this.status = "unauthorized";
        this.logout();
      }
    },

    setUserFromToken(token: string) {
      const decoded: any = jwtDecode(token);
      this.user = {
        id: decoded.Id,
        nombre: decoded.Nombre,
        email: decoded.Email,
        alias: decoded.Alias,
        rol: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        username: decoded.Alias,
        password:"",
        perfil: decoded.Image,
      };
    },

    async login(username: string, password: string) {
      this.status = "pending";
      try {
        const credentials = { username, password };
        const response: any = await apiRequest("auth.login", {}, credentials);

        if (response.accessToken && response.refreshToken && response.user) {
          this.setTokens(response.accessToken, response.refreshToken);
          this.setUserFromToken(response.accessToken);
          this.status = "authorized";
        } else {
          throw new Error(response.message || "Credenciales incorrectas");
        }
      } catch (error) {
        this.status = "unauthorized";
        this.token = null;
        this.user = null;
        console.error(error instanceof Error ? error.message : "Error desconocido en el login");
        throw error;
      }
    },

    setTokens(token: string, refreshToken: string) {
      this.token = token;
      this.refreshToken = refreshToken;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    async refreshTokenAsync() {
      try {
        const response: AxiosResponse = await axios.post(import.meta.env.VITE_APP_URL+"api/Auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        if (response.data.accessToken && response.data.refreshToken) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          this.setUserFromToken(response.data.accessToken);
        } else {
          console.error("Error al refrescar el token, respuesta incompleta.");
          this.logout();
        }
      } catch (error) {
        console.error("Error refrescando token", error);
        this.logout();
      }
    },

    logout() {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
    
      if (token && refreshToken) {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        delete axios.defaults.headers.common["Authorization"];
        this.status = "unauthorized";
    
        window.location.reload();
      } else {
        console.log("No se encontraron tokens, no es necesario hacer logout.");
      }
    },
    
    async updateUser(updatedUser: Partial<User>) {
      if (this.user) {
        const updatedData = {
          ...this.user,
          ...updatedUser,
        };
        this.user = updatedData;
      }
    },
    
    async refreshUserData() {
      if (!this.user?.id) {
        console.error("No hay usuario autenticado.");
        return;
      }

      try {
        const response = await axios.get(`/Persona/ObtenerDatosPerfil/${this.user.id}`);
        if (response.data.success) {
          const updatedUser = response.data.data;
          this.user = {
            ...this.user,
            username: updatedUser.username,
          };
        } else {
          console.error("Error al refrescar los datos del usuario:", response.data.message);
        }
      } catch (error) {
        console.error("Error en la solicitud de refresco de usuario:", error);
      }
    },

    async register(username: string, email: string, alias: string, password: string) {
      this.status = "pending";
      try {
        const response: any = await apiRequest("auth.register", {}, {
          email,
          username,
          alias,
          password,
        });
        if (response.accessToken && response.refreshToken) {
          this.setTokens(response.accessToken, response.refreshToken);
          this.setUserFromToken(response.accessToken);
          this.status = "authorized";
        } else {
          throw new Error("Error en el registro del cliente.");
        }
      } catch (error) {
        this.status = "unauthorized";
        this.token = null;
        this.user = null;
        console.error("Error en el registro del cliente:", error);
      }
    },
  },
});
