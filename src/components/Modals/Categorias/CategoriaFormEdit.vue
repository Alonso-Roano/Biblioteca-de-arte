<template>
  <Dialog
    :visible="localVisible"
    @update:visible="emitUpdate"
    header="Editar Exposición"
    :modal="true"
    style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Nombre</label>
        <InputText v-model="nombre" class="w-full" :class="{ 'p-invalid': errors.nombre }" />
        <small class="p-error" v-if="errors.nombre">{{ errors.nombre }}</small>
      </div>
      <div>
        <label class="block text-gray-600">Descripción de la Categoría</label>
        <InputText v-model="descripcionCategoria" class="w-full" :class="{ 'p-invalid': errors.descripcionCategoria }" />
        <small class="p-error" v-if="errors.descripcionCategoria">{{ errors.descripcionCategoria }}</small>
      </div>
      <div>
        <label class="block text-gray-600">Nombre Corto</label>
        <InputText v-model="nombreCorto" class="w-full" :class="{ 'p-invalid': errors.nombreCorto }" />
        <small class="p-error" v-if="errors.nombreCorto">{{ errors.nombreCorto }}</small>
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
import { Dialog, InputText, Button } from 'primevue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { CategoriaEdit } from '@/composables/categoriaFunctions';

const props = defineProps({
  Categoria: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['cancel', 'save', 'update:visible']);

const cancel = () => {
  emit('update:visible', false);
  emit('cancel');
};

const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const emitUpdate = (value: boolean) => {
  emit('update:visible', value);
};

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  descripcionCategoria: yup.string().required('La descripción es requerida'),
  nombreCorto: yup.string().required('El nombre corto es requerido'),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: nombre } = useField('nombre');
const { value: descripcionCategoria } = useField('descripcionCategoria');
const { value: nombreCorto } = useField('nombreCorto');
const idCategoria = ref(0);

watch(
  () => props.Categoria,
  (newCategoria) => {
    idCategoria.value = newCategoria.id;
    nombre.value = newCategoria.nombre || '';
    descripcionCategoria.value = newCategoria.descripcionCategoria || '';
    nombreCorto.value = newCategoria.nombreCorto || '';
  },
  { immediate: true }
);

const submitForm = handleSubmit((values) => {
  CategoriaEdit.value = { ...values, id: idCategoria.value };
  console.log(values, props.Categoria);
  emit('save');
});
</script>

<style scoped>
.custom-password :deep(.p-password-input) {
  width: 100%;
}
</style>