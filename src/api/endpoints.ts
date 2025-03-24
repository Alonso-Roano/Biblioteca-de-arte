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
        filtrar: { method: "GET", url: "/api/Persona/filter" },
        obtener: { method: "GET", url: "/api/Usuario/{id}" },
        crear: { method: "POST", url: "/api/Usuario" },
        actualizar: { method: "PUT", url: "/api/Persona/ActualizarPerfilUsuario/{id}" },
        eliminar: { method: "DELETE", url: "/api/Persona/{id}" },
    },
    artista: {
        listar: { method: "GET", url: "/api/Artista" },
        filtrar: { method: "GET", url: "/api/Artista/filter" },
        obtener: { method: "GET", url: "/api/Artista/{id}" },
        crear: { method: "POST", url: "/api/Artista" },
        actualizar: { method: "PUT", url: "/api/Artista/ActualizarPerfilArtista/{id}" },
        eliminar: { method: "DELETE", url: "/api/Artista/{id}" },
    },
    logAction: {
        listar: { method: "GET", url: "/api/LogAction" },
        filtrar: { method: "GET", url: "/api/LogAction/filter" },
        obtener: { method: "GET", url: "/api/LogAction/{id}" },
        crear: { method: "POST", url: "/api/LogAction" },
        actualizar: { method: "PUT", url: "/api/LogAction/{id}" },
        eliminar: { method: "DELETE", url: "/api/LogAction/{id}" },
    },
    logError: {
        listar: { method: "GET", url: "/api/LogError" },
        filtrar: { method: "GET", url: "/api/LogError/filter" },
        obtener: { method: "GET", url: "/api/LogError/{id}" },
        crear: { method: "POST", url: "/api/LogError" },
        actualizar: { method: "PUT", url: "/api/LogError/{id}" },
        eliminar: { method: "DELETE", url: "/api/LogError/{id}" },
    },
    galeria: {
        listar: { method: "GET", url: "/api/Galeria" },
        obtener: { method: "GET", url: "/api/Galeria/{id}" },
        crear: { method: "POST", url: "/api/Galeria" },
        actualizar: { method: "PUT", url: "/api/Galeria/{id}" },
        eliminar: { method: "DELETE", url: "/api/Galeria/{id}" },
    },
    
};

export default endpoints;
