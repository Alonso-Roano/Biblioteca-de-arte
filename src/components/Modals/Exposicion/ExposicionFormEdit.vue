<template>
  <Dialog :visible="localVisible" @update:visible="emitUpdate" header="Editar Exposición" :modal="true" style="background-color: #fff;  width: 500px; max-width: 100%; margin-inline: 20px;">
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Nombre</label>
        <InputText v-model="nombre" class="w-full" :class="{ 'p-invalid': errors.nombre }" />
        <small class="p-error" v-if="errors.nombre">{{ errors.nombre }}</small>
      </div>
      <div>
        <label class="block text-gray-600">Fecha de Inicio</label>
        <Calendar v-model="fechaInicio" class="w-full" :class="{ 'p-invalid': errors.fechaInicio }" showTime />
        <small class="p-error" v-if="errors.fechaInicio">{{ errors.fechaInicio }}</small>
      </div>
      <div>
        <label class="block text-gray-600">Fecha de Fin</label>
        <Calendar v-model="fechaFin" class="w-full" :class="{ 'p-invalid': errors.fechaFin }" showTime />
        <small class="p-error" v-if="errors.fechaFin">{{ errors.fechaFin }}</small>
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
import { Dialog, InputText, Calendar, Button } from 'primevue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { ExposicionEdit } from '@/composables/exposicionFunctions';

const props = defineProps({
Exposicion: {
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
nombre: yup.string().required('El nombre es requerido'),
fechaInicio: yup.date().required('La fecha de inicio es requerida'),
fechaFin: yup.date()
  .required('La fecha de fin es requerida')
  .min(yup.ref('fechaInicio'), 'La fecha de fin no puede ser anterior a la fecha de inicio')
});

const { handleSubmit, errors } = useForm({
validationSchema: schema
});

const { value: nombre } = useField('nombre');
const { value: fechaInicio } = useField('fechaInicio');
const { value: fechaFin } = useField('fechaFin');
const idExposicion = ref(0);

watch(
() => props.Exposicion,
(newExposicion) => {
  idExposicion.value = newExposicion.id;
  nombre.value = newExposicion.nombre || '';
  fechaInicio.value = new Date(newExposicion.fechaInicio) || null;
  fechaFin.value = new Date(newExposicion.fechaFin) || null;
},
{ immediate: true }
);

const submitForm = handleSubmit((values) => {
ExposicionEdit.value = { ...values, id: idExposicion };
console.log(values, props.Exposicion);
emit('save');
});
</script>

<style scoped>
.custom-password :deep(.p-password-input) {
width: 100%;
}
</style>