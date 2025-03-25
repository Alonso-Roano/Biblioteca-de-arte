import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Users = ref([])
export const IdUserDelete = ref<string | number>("")
export const newUser = ref({ nombres: '', email: '', apellidos: '', password: '', confirmPassword:'' })
export const userEdit = ref({ id: '', nombres: '', apellidos: '',edad:'', contraseña: '', idApplicationUser:'' })
export const userView = ref({ name: '', email: '', alias: '' })

export const fetchUsers = async (params:any = null) => {
  try {
    const users = <any> await apiRequest("usuario.filtrar",params)
    Users.value = users.data
  } catch (error) {
    console.log(error)
  }
}

export const createUser = async (toast: any) => {
  console.log(newUser.value)
  if (!newUser.value.nombres || !newUser.value.email || !newUser.value.apellidos || !newUser.value.password || !newUser.value.confirmPassword) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("auth.registerUser", {}, { ...newUser.value })
    if (response.token) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario', life: 3000 })
      throw new Error('Error al crear usuario')
    }
    await fetchUsers({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario', life: 3000 })
    return false
  }
}

export const editUser = (user: any) => {
  userEdit.value = { ...user, nombre: user.nombre, alias: user.alias }
}

export const updateUser = async (toast: any) => {
  console.log(userEdit.value)
  if (userEdit.value.nombres && userEdit.value.apellidos && userEdit.value.edad && userEdit.value.contraseña) {
    const usuario = userEdit.value
    const res = <any> await apiRequest("usuario.actualizar", { id: userEdit.value.idApplicationUser }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Editado correctamente', life: 3000 })
    }
    await fetchUsers({page:1,limit:5});
    return true 
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteUser = (id: any) => {
  IdUserDelete.value = id
}

export const removeUser = async (toast: any) => {
  try {
    const idUser = IdUserDelete.value
    const response = <any> await apiRequest("usuario.eliminar", { id: idUser })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 })
    }
    await fetchUsers({page:1,limit:5});
    return true 
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 })
    return false
  }
}