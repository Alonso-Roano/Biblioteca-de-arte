<template>
    <Dialog :visible="localVisible" @update:visible="emitUpdate" header="Editar Log" :modal="true" style="background-color: #fff;  width: 500px; max-width: 100%; margin-inline: 20px;">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-600">Recurso</label>
          <InputText v-model="source" class="w-full" :class="{ 'p-invalid': errors.source }" />
          <small class="p-error" v-if="errors.source">{{ errors.source }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Mensaje</label>
          <InputText v-model="message" class="w-full" :class="{ 'p-invalid': errors.message }" />
          <small class="p-error" v-if="errors.message">{{ errors.message }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Seguimiento</label>
          <Textarea v-model="stackTrace" class="w-full" :class="{ 'p-invalid': errors.stackTrace }" style="height: 200px;"/>
          <small class="p-error" v-if="errors.stackTrace">{{ errors.stackTrace }}</small>
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
  import { LogErrorEdit } from '@/composables/logErrorFunctions';
  
  const props = defineProps({
    LogError: {
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
    source: yup.string().required('El recurso es requerido'),
    message: yup.string().required('El mensaje es requerido'),
    stackTrace: yup.string().required('El seguimiento es requerido'),
  });
  
  
  const { handleSubmit, errors } = useForm({
    validationSchema: schema
  });
  
  const { value: source } = useField('source');
  const { value: message } = useField('message');
  const { value: stackTrace } = useField('stackTrace');
  const idError = ref(0);
  
  watch(
    () => props.LogError,
    (newLogError) => {
      idError.value = newLogError.id;
      source.value = newLogError.source || '';
      message.value = newLogError.message || '';
      stackTrace.value = newLogError.stackTrace || '';
    },
    { immediate: true }
  );
  
  const submitForm = handleSubmit((values) => {
    LogErrorEdit.value = {...values, id:idError.value};
    emit('save');
  });
  </script>
  
  
  <style scoped>
  .custom-password :deep(.p-password-input) {
    width: 100%;
  }
  </style>
  