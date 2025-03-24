

export interface Comentario {
    texto: string
    usuario: string
    fecha: string
  }

  export interface Galeria {
    id: number
    nombre: string
    descripcion: string
    precio: number
    imagen: string 
    categoria: string
    stock: number
    comentarios: Comentario[]
  }
