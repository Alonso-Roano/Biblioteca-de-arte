<template>
  <Dialog 
    :visible="localVisible" 
    @update:visible="emitUpdate" 
    header="Confirmar Eliminación" 
    :modal="true"
  >
    <div class="p-4 text-gray-600">
      <p>{{ texto }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" severity="secondary" @click="cancel" />
        <Button label="Eliminar" severity="danger" @click="$emit('confirm')" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  texto: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['cancel', 'confirm', 'update:visible']);

// Computed property para manejar el v-model correctamente
const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// Método para manejar la cancelación
const cancel = () => {
  emit('update:visible', false);
  emit('cancel');
};

// Método para actualizar el valor
const emitUpdate = (value: boolean) => {
  emit('update:visible', value);
};
</script>
