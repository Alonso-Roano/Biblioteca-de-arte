<template>
    <Dialog :visible="localVisible" @update:visible="emitUpdate" header="Editar Log" :modal="true" style="background-color: #fff;  width: 500px; max-width: 100%; margin-inline: 20px;">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-600">Accion</label>
          <InputText v-model="action" class="w-full" :class="{ 'p-invalid': errors.action }" />
          <small class="p-error" v-if="errors.action">{{ errors.action }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Detalles</label>
          <Textarea v-model="details" class="w-full" :class="{ 'p-invalid': errors.details }" style="height: 200px;"/>
          <small class="p-error" v-if="errors.details">{{ errors.details }}</small>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" severity="secondary" @click="cancel" />
          <Button label="Guardar" severity="success" @click="submitForm" />
        </div>
      </div>
    </Dialog>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits, watch, ref } from 'vue';
  import { Dialog, InputText, Password, Button, Textarea } from 'primevue';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import { LogActionEdit } from '@/composables/logActionFunctions';
  
  const props = defineProps({
    LogAction: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['cancel', 'save', 'update:visible']);
  
  const cancel = () => {
    emit('update:visible', false);
    emit('cancel');
  };
  
  const localVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  });
  
  const emitUpdate = (value: boolean) => {
    emit('update:visible', value);
  };
  
  const schema = yup.object({
    action: yup.string().required('La accion es requerida'),
    details: yup.string().required('Los detalles son requeridos'),
  });
  
  const { handleSubmit, errors } = useForm({
    validationSchema: schema
  });
  
  const { value: action } = useField('action');
  const { value: details } = useField('details');
  const idAction = ref(0);
  
  watch(
    () => props.LogAction,
    (newLogAction) => {
      idAction.value = newLogAction.id;
      action.value = newLogAction.action || '';
      details.value = newLogAction.details || '';
    },
    { immediate: true }
  );
  
  const submitForm = handleSubmit((values) => {
    LogActionEdit.value = {...values, id:idAction};
    console.log(values, props.LogAction)
    emit('save');
  });
  </script>
  
  
  <style scoped>
  .custom-password :deep(.p-password-input) {
    width: 100%;
  }
  </style>
  