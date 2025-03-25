<template>
  <Dialog
    :visible="localVisible"
    @update:visible="emitCreate"
    header="Agregar Comentario"
    :modal="true"
    style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-gray-600">Obra*</label>
        <Dropdown 
          v-model="idObra" 
          :options="obras" 
          optionLabel="titulo" 
          optionValue="id" 
          class="w-full" 
          :class="{ 'p-invalid': errors.idObra }"
          placeholder="Seleccione una obra"
        />
        <small class="p-error" v-if="errors.idObra">{{ errors.idObra }}</small>
      </div>
      
      <div>
        <label class="block text-gray-600">Persona*</label>
        <Dropdown 
          v-model="idPersona" 
          :options="usuarios" 
          optionLabel="nombres" 
          optionValue="id" 
          class="w-full" 
          :class="{ 'p-invalid': errors.idPersona }"
          placeholder="Seleccione una persona"
        />
        <small class="p-error" v-if="errors.idPersona">{{ errors.idPersona }}</small>
      </div>
      
      <div>
        <label class="block text-gray-600">Comentario*</label>
        <Textarea 
          v-model="texto" 
          class="w-full" 
          :class="{ 'p-invalid': errors.texto }" 
          rows="3"
        />
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
import { computed, defineProps, defineEmits, ref, onMounted } from 'vue';
import { Dialog, InputText, Button, Dropdown, Textarea } from 'primevue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { Users,fetchUsers } from '@/composables/userFunctions';
import { fetchObras, Obras } from '@/composables/obraFunctions';
import { newComentario } from '@/composables/comentarioFunctions';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['cancel', 'save', 'update:visible']);

const usuarios = ref([]);
const obras = ref([]);

// Cargar datos iniciales
onMounted(async () => {
  try {
    await fetchUsers({ orderDirection: "asc" })
    usuarios.value = Users.value.items;
    await fetchObras({ orderDirection: "asc" })
    obras.value = Obras.value.items;
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});

const cancel = () => {
  emit('update:visible', false);
  emit('cancel');
};

const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const emitCreate = (value: boolean) => {
  emit('update:visible', value);
};

const schema = yup.object({
  idPersona: yup.number().required('La persona es requerida').min(1, 'Seleccione una persona'),
  idObra: yup.number().required('La obra es requerida').min(1, 'Seleccione una obra'),
  texto: yup.string().required('El comentario es requerido'),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: idPersona } = useField('idPersona');
const { value: idObra } = useField('idObra');
const { value: texto } = useField('texto');

// Función para enviar el formulario
const submitForm = handleSubmit((values) => {
  const comentarioData = {
    idPersona: values.idPersona,
    idObra: values.idObra,
    texto: values.texto,
    fechaComentario: new Date().toISOString() // Fecha actual en formato ISO
  };
  newComentario.value = comentarioData;
  
  emit('save', comentarioData);
});
</script>

<style scoped>
.p-invalid {
  border-color: var(--red-500) !important;
}
</style>