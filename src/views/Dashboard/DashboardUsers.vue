<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Button, Dialog, InputText, Password, Toast } from 'primevue'
import { Icon } from "@iconify/vue";
const showModalEdit = ref(false)
const Users = ref()

const IdUserDelete = ref<string|number>("")
import IconPlus from '@/components/icons/IconPlus.vue'
import { apiRequest } from '@/api/apiClient'
const confirmDeleteModal = ref(false)

const showModalView = ref(false)
const userView = ref({
  name: '',
  email: '',
  alias: '',  
})

const viewUser = (user: any) => {
  userView.value = { ...user, alias: user.alias }
  showModalView.value = true
}

const showModal = ref(false)
const newUser = ref({
  username: '', 
  email: '', 
  alias: '',   
  password: '',
})
const userEdit = ref({
  id: '',
  nombre: '', 
  alias: '', 
  password: '', 
})


const toast = ref()

const fetchUsers = async () => {
  try {
    const users = <any>await apiRequest("usuario.listar")
    Users.value = users.data; 
  } catch (error) {
    console.log(error)
  } 
}

onMounted(fetchUsers)

const createUser = async () => {
  if (
    !newUser.value.username ||
    !newUser.value.email ||
    !newUser.value.alias || 
    !newUser.value.password
  ) {
    toast.value.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Todos los campos son obligatorios',
      life: 3000,
    })
    return
  }

  try {
    const response: any = await apiRequest("auth.register",{}, {...newUser.value})
    console.log(response)
    if (response.accessToken) {
      toast.value.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente',
        life: 3000,
      })
    } else {
      toast.value.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear el usuario',
        life: 3000,
      })
      throw new Error('Error al crear usuario')
    }
    showModal.value = false
    fetchUsers()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo crear el usuario',
      life: 3000,
    })
  }
}

const editUser = (user: any) => {
  userEdit.value = { ...user, nombre: user.nombre, alias: user.alias }
  showModalEdit.value = true
}

const updateUser = async () => {
  if (userEdit.value.nombre && userEdit.value.alias && userEdit.value.password) {
    const usuario = userEdit.value;
    const res: any = await apiRequest("usuario.actualizar",{id: userEdit.value.id}, {Nombre: usuario.nombre, Alias: usuario.alias, Password: usuario.password})
    if (res.nombre) {
      toast.value.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario Editado correctamente',
        life: 3000,
      })
    }
    showModalEdit.value = false
    fetchUsers()
    console.log(res)
  } else {
    toast.value.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Todos los campos son obligatorios',
      life: 3000,
    })
  }
}

const deleteUser = (id: any) => {
  IdUserDelete.value = id
  confirmDeleteModal.value = true
}

const removeUser = async () => {
  try {
    const idUser:any= IdUserDelete.value;
    const response: any = await apiRequest("usuario.eliminar",{id: idUser})
    console.log(response)

    if (response.message) {
      toast.value.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado correctamente',
        life: 3000,
      })
    } else {
      toast.value.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el usuario',
        life: 3000,
      })
    }
    fetchUsers()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el usuario',
      life: 3000,
    })
  } finally {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard>
    <template #content>
      <div class="py-4 m-2">
        <div class="flex w-full justify-between mb-1.5">
          <h2 class="block text-2xl text-gray-600 p-2 font-semibold ">Usuarios</h2>
          <div @click="showModal = true"
            class="flex items-center gap-0.5 rounded-md py-0.5 px-1 bg-blue-500 text-white w-fit font-semibold ml-1 my-1 cursor-pointer">
            <IconPlus class="size-4" />
            <button>Añadir</button>
          </div>
        </div>
        <!-- Tabla de usuarios -->
        <DataTable :value="Users" tableStyle="min-width: 50rem" paginator :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]">
          <Column field="nombre" header="Nombre"></Column>
          <Column field="email" header="Correo"></Column>
          <Column field="alias" header="Alias"></Column> <!-- Nuevo campo alias -->
          <Column header="Acciones">
            <template #body="props">
              <span class="block">
                <Button icon="pi pi-eye" variant="text" rounded aria-label="Ver" @click="viewUser(props.data)">
                  <Icon icon="akar-icons:info-fill" width="24" height="24" />
                </Button>
                <Button icon="pi pi-pencil" variant="text" severity="info" rounded aria-label="Editar"
                  @click="editUser(props.data)" ><Icon icon="mdi:pencil-outline" width="24" height="24" />
                </Button>
                <Button icon="pi pi-trash" severity="danger" variant="text" rounded aria-label="Eliminar"
                  @click="deleteUser(props.data.id)" ><Icon icon="material-symbols:delete" width="24" height="24" />
                </Button>
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Modal de creación -->
      <Dialog v-model:visible="showModal" header="Crear Usuario" :modal="true">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Nombre</label>
            <InputText v-model="newUser.username" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Correo Electrónico</label>
            <InputText type="email" v-model="newUser.email" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Alias</label>
            <InputText v-model="newUser.alias" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Contraseña</label>
            <Password v-model="newUser.password" class="w-full" toggleMask />
          </div>
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" @click="showModal = false" />
            <Button label="Crear" severity="success" @click="createUser" />
          </div>
        </div>
      </Dialog>

      <!-- Modal de edicion -->
      <Dialog v-model:visible="showModalEdit" header="Editar Usuario" :modal="true">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Nombre</label>
            <InputText v-model="userEdit.nombre" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Alias</label>
            <InputText v-model="userEdit.alias" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Contraseña</label>
            <Password v-model="userEdit.password" class="w-full" toggleMask />
          </div>
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" @click="showModalEdit = false" />
            <Button label="Guardar" severity="success" @click="updateUser" />
          </div>
        </div>
      </Dialog>

      <!-- Modal para Eliminacion -->
      <Dialog v-model:visible="confirmDeleteModal" header="Confirmar Eliminación" :modal="true">
        <div class="p-4 text-gray-600">
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" severity="secondary" @click="confirmDeleteModal = false" />
            <Button label="Eliminar" severity="danger" @click="removeUser" />
          </div>
        </div>
      </Dialog>

      <!-- Modal de ver usuario -->
      <Dialog v-model:visible="showModalView" header="Detalles del Usuario" :modal="true"
        style="background-color: #fff;">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Nombre</label>
            <InputText v-model="userView.nombre" class="w-full" disabled />
          </div>
          <div>
            <label class="block text-gray-600">Correo Electrónico</label>
            <InputText type="email" v-model="userView.email" class="w-full" disabled />
          </div>
          <div>
            <label class="block text-gray-600">Alias</label>
            <InputText v-model="userView.alias" class="w-full" disabled /> <!-- Mostrar alias -->
          </div>
          <div class="flex justify-end">
            <Button label="Cerrar" severity="secondary" @click="showModalView = false" />
          </div>
        </div>
      </Dialog>

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>
