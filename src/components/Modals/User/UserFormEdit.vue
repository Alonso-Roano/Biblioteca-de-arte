<template>
  <Dialog :visible="localVisible" @update:visible="emitUpdate" header="Editar Usuario" :modal="true" style="background-color: #fff;  width: 500px; max-width: 100%; margin-inline: 20px;">
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
import { userEdit } from '@/composables/userFunctions';

const props = defineProps({
  user: {
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
const { value: contraseña } = useField('contraseña');

// Watch for changes in the user prop and update the form values accordingly
watch(
  () => props.user,
  (newUser) => {
    nombres.value = newUser.nombres || '';
    apellidos.value = newUser.apellidos || '';
    edad.value = newUser.edad || '';
    contraseña.value = newUser.contraseña || '';
  },
  { immediate: true } // Ensure it runs immediately when the component is mounted
);

const submitForm = handleSubmit((values) => {
  userEdit.value = {...values, idApplicationUser: props.user.idApplicationUser};
  console.log(values, props.user.idApplicationUser)
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
