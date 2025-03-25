<template>
    <Dialog :visible="localVisible" @update:visible="emitCreate" header="Agregar Artista" :modal="true" style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-600">Nombres</label>
          <InputText v-model="nombres" class="w-full" :class="{ 'p-invalid': errors.nombres }" />
          <small class="p-error" v-if="errors.nombres">{{ errors.nombres }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Apellidos</label>
          <InputText v-model="apellidos" class="w-full" :class="{ 'p-invalid': errors.apellidos }" />
          <small class="p-error" v-if="errors.apellidos">{{ errors.apellidos }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Correo Electrónico</label>
          <InputText type="email" v-model="email" class="w-full" :class="{ 'p-invalid': errors.email }" />
          <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Contraseña</label>
          <Password v-model="password" class="w-full custom-password" toggleMask :class="{ 'p-invalid': errors.password }" style="width: 100%;"/>
          <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Confirmar Contraseña</label>
          <Password v-model="confirmPassword" class="w-full custom-password" toggleMask :class="{ 'p-invalid': errors.confirmPassword }" />
          <small class="p-error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</small>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" severity="secondary" @click="cancel" />
          <Button label="Guardar" severity="success" @click="submitForm" />
        </div>
      </div>
    </Dialog>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';
  import { Dialog, InputText, Password, Button } from 'primevue';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import { newArtist } from '@/composables/artistaFunctions';
  
  const props = defineProps({
    artist: {
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
  
  const emitCreate = (value: boolean) => {
    emit('update:visible', value);
  };
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*]).{6,}$/;
  
  const schema = yup.object({
    nombres: yup.string().required('Los nombres son requeridos'),
    apellidos: yup.string().required('Los apellidos son requeridos'),
    email: yup.string().email('Debe ser un correo electrónico válido').required('El correo electrónico es requerido'),
    password: yup
      .string()
      .required('La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .matches(
        passwordRegex,
        'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (como .)'
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
      .required('La confirmación de la contraseña es requerida')
  });
  
  const { handleSubmit, errors } = useForm({
    validationSchema: schema
  });
  
  const { value: nombres } = useField('nombres');
  const { value: apellidos } = useField('apellidos');
  const { value: email } = useField('email');
  const { value: password } = useField('password');
  const { value: confirmPassword } = useField('confirmPassword');
  
  // Función para enviar el formulario
  const submitForm = handleSubmit((values) => {
    newArtist.value = values
    emit('save', {
      id: '',
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      nombres: values.nombres,
      apellidos: values.apellidos
    });
  });
  </script>
  <style scoped>
  .custom-password :deep(.p-password-input) {
    width: 100%;
  }
  </style>