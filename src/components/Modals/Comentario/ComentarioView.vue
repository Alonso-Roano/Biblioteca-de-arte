<template>
  <Dialog
    :visible="localVisible"
    @update:visible="emitUpdate"
    header="Detalles del Comentario"
    :modal="true"
    style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Id</label>
        <InputText v-model="Comentario.id" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Texto</label>
        <InputText v-model="Comentario.texto" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Fecha del Comentario</label>
        <InputText v-model="Comentario.fechaComentario" class="w-full" disabled />
      </div>
      <div>
        <label class="block text-gray-600">Fecha de Creación</label>
        <InputText v-model="Comentario.createdAt" class="w-full" disabled />
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
    required: true,
  },
  Comentario: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save', 'update:visible']);

const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const closeModal = () => {
  emit('update:visible', false);
  emit('close');
};

const emitUpdate = (value: boolean) => {
  emit('update:visible', value);
};
</script>