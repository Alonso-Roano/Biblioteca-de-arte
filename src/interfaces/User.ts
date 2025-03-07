export default interface User {
  id: number | null,
  email: string,
  nombre:string,
  username: string,
  alias: string,
  rol:string,
  perfil:string,
  password: string | null
}
