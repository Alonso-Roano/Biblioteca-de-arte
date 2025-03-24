<template>
  <Dialog 
    :visible="localVisible" 
    @update:visible="emitUpdate" 
    header="Detalles del Usuario" 
    :modal="true" 
    style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Id</label>
        <InputText v-model="user.id" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Nombre</label>
        <InputText v-model="user.nombres" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Apellido</label>
        <InputText v-model="user.apellidos" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Edad</label>
        <InputText v-model="user.edad" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Application User</label>
        <InputText v-model="user.idApplicationUser" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Fecha de creacion</label>
        <InputText v-model="user.createdAt" class="w-full" disabled />
      </div>
      <div class="flex justify-end">
        <Button label="Cerrar" severity="secondary" @click="closeModal" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { Dialog, InputText, Button } from 'primevue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save', 'update:visible']);

const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const closeModal = () => {
  emit('update:visible', false);
  emit('close');
};

const emitUpdate = (value: boolean) => {
  emit('update:visible', value);
};
</script>
