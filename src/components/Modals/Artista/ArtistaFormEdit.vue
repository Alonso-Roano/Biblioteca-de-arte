<template>
    <Dialog :visible="localVisible" @update:visible="emitUpdate" header="Editar Artista" :modal="true" style="background-color: #fff;  width: 500px; max-width: 100%; margin-inline: 20px;">
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
          <label class="block text-gray-600">Biografia</label>
          <InputText v-model="biografia" class="w-full" :class="{ 'p-invalid': errors.briografia }" />
          <small class="p-error" v-if="errors.biografia">{{ errors.biografia }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Pais</label>
          <InputText v-model="pais" class="w-full" :class="{ 'p-invalid': errors.pais }" />
          <small class="p-error" v-if="errors.pais">{{ errors.pais }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Edad</label>
          <InputText type="number" v-model="edad" class="w-full" :class="{ 'p-invalid': errors.edad }" />
          <small class="p-error" v-if="errors.edad">{{ errors.edad }}</small>
        </div>
        <div>
          <label class="block text-gray-600">Contraseña</label>
          <Password v-model="contraseña" class="w-full custom-password" toggleMask :class="{ 'p-invalid': errors.contraseña }" />
          <small class="p-error" v-if="errors.contraseña">{{ errors.contraseña }}</small>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" severity="secondary" @click="cancel" />
          <Button label="Guardar" severity="success" @click="submitForm" />
        </div>
      </div>
    </Dialog>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits, watch } from 'vue';
  import { Dialog, InputText, Password, Button } from 'primevue';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import { ArtistEdit } from '@/composables/artistaFunctions';
  
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
  
  const emitUpdate = (value: boolean) => {
    emit('update:visible', value);
  };
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*]).{6,}$/;
  
  const schema = yup.object({
    nombres: yup.string().required('Los nombres son requeridos'),
    apellidos: yup.string().required('Los apellidos son requeridos'),
    biografia: yup.string().required('La biografia es requerida'),
    pais: yup.string().required('El pais es requerido'),
    edad: yup.number().required('La edad es requerida').positive('La edad debe ser un número positivo').integer('La edad debe ser un número entero'),
    contraseña: yup
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .matches(
        passwordRegex,
        'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (como .)'
      )
      .notRequired()
  });
  
  const { handleSubmit, errors } = useForm({
    validationSchema: schema
  });
  
  const { value: nombres } = useField('nombres');
  const { value: apellidos } = useField('apellidos');
  const { value: edad } = useField('edad');
  const { value: biografia } = useField('biografia');
  const { value: pais } = useField('pais');
  const { value: contraseña } = useField('contraseña');
  
  // Watch for changes in the artist prop and update the form values accordingly
  watch(
    () => props.artist,
    (newartist) => {
      nombres.value = newartist.nombres || '';
      apellidos.value = newartist.apellidos || '';
      biografia.value = newartist.biografia || '';
      pais.value = newartist.pais || '';
      edad.value = newartist.edad || '';
      contraseña.value = newartist.contraseña || '';
    },
    { immediate: true } // Ensure it runs immediately when the component is mounted
  );
  
  const submitForm = handleSubmit((values) => {
    ArtistEdit.value = {...values, idApplicationUser: props.artist.idApplicationUser};
    console.log(values, props.artist.idApplicationartist)
    emit('save', {
      nombres: values.nombres,
      apellidos: values.apellidos,
      edad: values.edad,
      contraseña: values.contraseña
    });
  });
  </script>
  
  
  <style scoped>
  .custom-password :deep(.p-password-input) {
    width: 100%;
  }
  </style>
  