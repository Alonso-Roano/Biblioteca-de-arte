import { defineStore } from "pinia";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import type { AxiosResponse } from "axios";
import type User from "../interfaces/User";
import endpoints from "@/api/endpoints";
import { apiRequest } from "@/api/apiClient";
import Cookies from "js-cookie";

interface AuthState {
  status: "unauthorized" | "pending" | "authorized";
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    status: "unauthorized",
    token: Cookies.get("token") || null,
    refreshToken: Cookies.get("refreshToken") || null,
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
      const token = this.token || Cookies.get("token");
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

    async login(email: string, password: string) {
      this.status = "pending";
      try {
        const credentials = { email, password };
        const response: any = await apiRequest("auth.login", {}, credentials);

        if (response.token && response.refreshToken && response.user) {
          this.setTokens(response.token, response.refreshToken);
          this.setUserFromToken(response.token);
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
      localStorage.setItem("refreshToken", refreshToken);
      Cookies.set("token", token, { secure: true, sameSite: "Strict" });
      Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "Strict" });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    async refreshTokenAsync() {
      console.log(localStorage.getItem("refreshToken"))
      const sendToken = localStorage.getItem("refreshToken");
      try {
        const response: AxiosResponse = await axios.post(import.meta.env.VITE_APP_URL+"api/Auth/refresh", {
          token: sendToken,
        });
        if (response.data.accessToken && response.data.refreshToken) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          this.setUserFromToken(response.data.accessToken);
        } else {
          console.error("Error al refrescar el token, respuesta incompleta.");
        }
      } catch (error) {
        console.error("Error refrescando token", error);
      }
    },

    logout() {
      if (Cookies.get("token") && Cookies.get("refreshToken")) {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        Cookies.remove("token");
        localStorage.removeItem("refreshToken")
        Cookies.remove("refreshToken");
        delete axios.defaults.headers.common["Authorization"];
        this.status = "unauthorized";
        setTimeout(() => {
          window.location.reload()
        }, 2000)
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

    async register(nombres: string, apellidos: string, email: string, password: string, confirmPassword:string, artista:boolean = false ) {
      this.status = "pending";
      try {
        const response: any = await apiRequest(artista ? "auth.registerArtist":"auth.registerUser", {}, {
          id:"0",
          email,
          nombres,
          apellidos,
          password,
          confirmPassword
        });
        if (response.token && response.refreshToken) {
          this.setTokens(response.token, response.refreshToken);
          this.setUserFromToken(response.token);
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
