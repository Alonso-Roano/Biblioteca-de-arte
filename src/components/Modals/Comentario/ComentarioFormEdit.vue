<template>
  <Dialog
    :visible="localVisible"
    @update:visible="emitUpdate"
    header="Editar Comentario"
    :modal="true"
    style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Comentario</label>
        <InputText v-model="texto" class="w-full" :class="{ 'p-invalid': errors.texto }" />
        <small class="p-error" v-if="errors.texto">{{ errors.texto }}</small>
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
import { ComentarioEdit } from '@/composables/comentarioFunctions';

const props = defineProps({
  Comentario: {
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
  texto: yup.string().required('El nombre es requerido'),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: texto } = useField('texto');
const idComentario = ref(0);
const idObra = ref(0);
const idPersona = ref(0);
const fechaComentario = ref(0);

watch(
  () => props.Comentario,
  (newComentario) => {
    idComentario.value = newComentario.id;
    idPersona.value = newComentario.idPersona;
    idObra.value = newComentario.idObra;
    fechaComentario.value = newComentario.fechaComentario;
    texto.value = newComentario.texto || '';
  },
  { immediate: true }
);

const submitForm = handleSubmit((values) => {
  ComentarioEdit.value = { ...values, id: idComentario.value, idPersona: idPersona.value, idObra: idObra.value, fechaComentario: fechaComentario.value, isDeleted:false  };
  emit('save');
});
</script>

<style scoped>
.custom-password :deep(.p-password-input) {
  width: 100%;
}
</style>