const endpoints = {
    auth: {
        registerUser: { method: "POST", url: "/api/Auth/registrarUsuario" },
        registerArtist: { method: "POST", url: "/api/Auth/registrarArtista" },
        login: { method: "POST", url: "/api/Auth/login" },
        refresh: { method: "POST", url: "/api/Auth/refresh" },
        metrics: { method: "GET", url: "/api/Auth/metrics" },
        update: { method: "PUT", url: "/api/Auth/update-profile" },
    },
    etiqueta: {
        listar: { method: "GET", url: "/api/Etiqueta" },
        obtener: { method: "GET", url: "/api/Etiqueta/{id}" },
        crear: { method: "POST", url: "/api/Etiqueta" },
        actualizar: { method: "PUT", url: "/api/Etiqueta/{id}" },
        eliminar: { method: "DELETE", url: "/api/Etiqueta/{id}" },
    },
    libro: {
        listar: { method: "GET", url: "/api/Libro" },
        obtener: { method: "GET", url: "/api/Libro/{id}" },
        crear: { method: "POST", url: "/api/Libro" },
        crearUser: { method: "POST", url: "/api/Libro/user" },
        actualizar: { method: "PUT", url: "/api/Libro/{id}" },
        eliminar: { method: "DELETE", url: "/api/Libro/{id}" },
        obtenerPorSlug: { method: "GET", url: "/api/Libro/slug/{slug}" },
        obtenerPorAutor: { method: "GET", url: "/api/Libro/autor" },
        buscar: { method: "GET", url: "/api/Libro/buscar" },
    },
    like: {
        toggle: { method: "POST", url: "/api/Like/toggle/{libroId}" },
        likesInfo: { method: "GET", url: "/api/Like/likes-info/{libroId}" },
        allLikesInfo: { method: "GET", url: "/api/Like/all-likes-info" },
        deleteAll: { method: "DELETE", url: "/api/Like/delete-all" },
        usuario: { method: "GET", url: "/api/Like/usuario" },
    },
    usuario: {
        listar: { method: "GET", url: "/api/Persona" },
        obtener: { method: "GET", url: "/api/Usuario/{id}" },
        crear: { method: "POST", url: "/api/Usuario" },
        actualizar: { method: "PUT", url: "/api/Usuario/{id}" },
        eliminar: { method: "DELETE", url: "/api/Usuario/{id}" },
    }
};

export default endpoints;
