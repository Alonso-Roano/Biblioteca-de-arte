<template>
    <Dialog 
      :visible="localVisible" 
      @update:visible="emitUpdate" 
      header="Detalles del Log" 
      :modal="true" 
      style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-600">Id</label>
          <InputText v-model="LogAction.id" class="w-full" disabled />
        </div>
        <div>
          <label class="block text-gray-600">Accion</label>
          <InputText v-model="LogAction.action" class="w-full" disabled />
        </div>
        <div>
          <label class="block text-gray-600">Detalles</label>
          <Textarea v-model="LogAction.details" class="w-full" disabled style="height: 200px;"/>
        </div>
        <div>
          <label class="block text-gray-600">Fecha de creacion</label>
          <InputText v-model="LogAction.createdAt" class="w-full" disabled />
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
      required: true
    },
    LogAction: {
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
  