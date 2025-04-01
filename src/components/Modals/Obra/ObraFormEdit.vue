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
        <label class="block text-gray-600">Título*</label>
        <InputText
          v-model="titulo"
          class="w-full"
          :class="{ 'p-invalid': errors.titulo }"
        />
        <small class="p-error">{{ errors.titulo }}</small>
      </div>

      <div>
        <label class="block text-gray-600">Descripción*</label>
        <Textarea
          v-model="descripcion"
          class="w-full"
          :class="{ 'p-invalid': errors.descripcion }"
          rows="3"
        />
        <small class="p-error">{{ errors.descripcion }}</small>
      </div>

      <div>
        <label class="block text-gray-600">Precio (USD)*</label>
        <InputNumber
          v-model="precio"
          class="w-full"
          :class="{ 'p-invalid': errors.precio }"
          mode="currency"
          currency="USD"
          locale="en-US"
        />
        <small class="p-error">{{ errors.precio }}</small>
      </div>

      <div>
        <label class="block text-gray-600">Categorías*</label>
        <MultiSelect
          v-model="categoriaIds"
          :options="categoria"
          optionLabel="nombre"
          optionValue="id"
          class="w-full"
          :class="{ 'p-invalid': errors.categoriaIds }"
          placeholder="Seleccione categorías"
        />
        <small class="p-error">{{ errors.categoriaIds }}</small>
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="cancel" />
        <Button label="Guardar" severity="success" @click="submitForm" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, watch, ref, onMounted } from 'vue';
import { Dialog, InputText, Button, InputNumber, Dropdown, MultiSelect, Textarea } from 'primevue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { ObraEdit } from '@/composables/obraFunctions';
import { Artists, fetchArtists } from '@/composables/artistaFunctions';
import { Categorias, fetchCategorias } from '@/composables/categoriaFunctions';

const artistas = ref([]);
const categoria = ref([]);

onMounted(async () => {
  try {
    await fetchCategorias({ orderDirection: "asc" });
    categoria.value = Categorias.value.items;
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});

const props = defineProps({
  Obra: {
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
  titulo: yup.string().required('El título es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  precio: yup.number()
    .required('El precio es requerido')
    .min(0.01, 'El precio debe ser mayor a 0'),
  categoriaIds: yup.array()
    .min(1, 'Debe seleccionar al menos una categoría')
    .required('Debe seleccionar al menos una categoría'),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: titulo } = useField('titulo');
const { value: descripcion } = useField('descripcion');
const { value: precio } = useField('precio');
const { value: categoriaIds } = useField('categoriaIds');
const idObra = ref(0);
const urlObra = ref("");

watch(
  () => props.Obra,
  (newObra) => {
    idObra.value = newObra.id;
    urlObra.value = newObra.imagenUrl;
    titulo.value = newObra.titulo || '';
    descripcion.value = newObra.descripcion || '';
    precio.value = newObra.precio || '';
    categoriaIds.value =
      typeof newObra.categoriaIds === 'string'
        ? newObra.categoriaIds.split(',').map(item => item.trim())
        : newObra.categoriaIds || [];
  },
  { immediate: true }
);

const submitForm = handleSubmit((values) => {
  ObraEdit.value = { ...values, id: idObra.value, ImagenUrl: urlObra.value };
  console.log(values, props.Obra);
  emit('save');
});
</script>

<style scoped>
.custom-password :deep(.p-password-input) {
  width: 100%;
}
</style>
