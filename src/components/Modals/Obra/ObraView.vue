<template>
  <Dialog
    :visible="localVisible"
    @update:visible="emitUpdate"
    header="Detalles de la Obra"
    :modal="true"
    style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Id</label>
        <InputText v-model="Obra.id" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Título</label>
        <InputText v-model="Obra.titulo" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Descripción</label>
        <Textarea v-model="Obra.descripcion" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Precio</label>
        <InputText v-model="Obra.precio" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600 mb-2">Imagen</label>
        <img :src="getImageUrl(Obra.imagenUrl)" alt="" class=" rounded-2xl">
      </div>
      <div>
        <label class="block text-gray-600">Slug</label>
        <InputText v-model="Obra.slug" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Fecha de Creación</label>
        <InputText v-model="Obra.createdAt" class="w-full" disabled />
      </div>
      <div class="flex justify-end">
        <Button label="Cerrar" severity="secondary" @click="closeModal" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { Dialog, InputText, Button, Textarea } from 'primevue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  Obra: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save', 'update:visible']);

const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path:any) => {
  return `${baseUrl}${path}`;
};


const closeModal = () => {
  emit('update:visible', false);
  emit('close');
};

const emitUpdate = (value: boolean) => {
  emit('update:visible', value);
};
</script>