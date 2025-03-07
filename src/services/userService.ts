import { genericRequest } from '@/utils/genericRequest'
const base_url: string = import.meta.env.APP_URL ?? 'http://localhost:3000'
import type { Method } from '@/interfaces/Request'
export const loginService = async (email: string, password: string) => {
  return await genericRequest(base_url + '/users/login', 'Post', { email, password })
}
export const registerService = async (email: string, password: string) => {
  return await genericRequest(base_url + '/users/register', 'Post', { email, password })
}
export const requestService = (
  path: string,
  method: Method,
  body: object,
  params: object,
  headers: object,
) => {}
