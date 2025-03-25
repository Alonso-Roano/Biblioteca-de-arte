<template>
  <Dialog
    :visible="localVisible"
    @update:visible="emitCreate"
    header="Agregar Obra de Arte"
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
        <label class="block text-gray-600">Artista*</label>
        <Dropdown 
          v-model="artistaId" 
          :options="artistas" 
          optionLabel="nombres" 
          optionValue="id" 
          class="w-full" 
          :class="{ 'p-invalid': errors.artistaId }"
          placeholder="Seleccione un artista"
        />
        <small class="p-error">{{ errors.artistaId }}</small>
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
      
      <div>
        <label class="block text-gray-600 mb-2">Imagen de la Obra*</label>
        <div class="relative">
          <input 
            type="file" 
            id="fileInput"
            @change="handleFileChange" 
            accept="image/*" 
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <label 
            for="fileInput" 
            class="block w-full p-4 border-2 border-dashed rounded-lg"
            :class="{
              'border-gray-300 hover:border-primary': !errors.imagen,
              'border-red-500': errors.imagen,
              'border-primary': previewImage
            }"
          >
            <div class="flex flex-col items-center justify-center gap-2">
              <i v-if="!previewImage" class="pi pi-cloud-upload text-3xl text-gray-400"></i>
              <img v-else :src="previewImage" class="max-h-32 object-contain mb-2 rounded" />
              <span class="text-sm text-gray-600">
                {{ previewImage ? 'Cambiar imagen' : 'Haz clic para subir una imagen' }}
              </span>
              <span v-if="imagen?.name" class="text-xs text-gray-500 mt-1">
                {{ imagen.name }}
              </span>
            </div>
          </label>
        </div>
        <small class="p-error">{{ errors.imagen }}</small>
      </div>
      
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="cancel" />
        <Button label="Guardar" severity="success" @click="submitForm" :loading="loading" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { Dialog, InputText, Button, InputNumber, Dropdown, MultiSelect, Textarea } from 'primevue';
import { newObra, createObra } from '@/composables/obraFunctions';
import { Artists, fetchArtists } from '@/composables/artistaFunctions';
import { Categorias, fetchCategorias } from '@/composables/categoriaFunctions';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['cancel', 'save', 'update:visible']);

const loading = ref(false);
const artistas = ref([]);
const categoria = ref([]);
const previewImage = ref('');

const schema = yup.object({
  titulo: yup.string().required('El título es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  precio: yup.number()
    .required('El precio es requerido')
    .min(0.01, 'El precio debe ser mayor a 0'),
  artistaId: yup.number()
    .required('Debe seleccionar un artista')
    .min(1, 'Debe seleccionar un artista'),
  categoriaIds: yup.array()
    .min(1, 'Debe seleccionar al menos una categoría')
    .required('Debe seleccionar al menos una categoría'),
  imagen: yup.mixed()
    .required('La imagen es requerida')
    .test('fileType', 'Solo se permiten imágenes', (value) => {
      if (!value) return false;
      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
    })
    .test('fileSize', 'La imagen es demasiado grande (máx. 2MB)', (value) => {
      if (!value) return false;
      return value.size <= 2000000; // 2MB
    })
});

// Configuración de `vee-validate`
const { handleSubmit, errors } = useForm({ validationSchema: schema });

// Enlazamos los campos con `useField`
const { value: titulo } = useField('titulo');
const { value: descripcion } = useField('descripcion');
const { value: precio } = useField('precio');
const { value: artistaId } = useField('artistaId');
const { value: categoriaIds } = useField('categoriaIds');
const { value: imagen } = useField('imagen');

// Cargar datos iniciales
onMounted(async () => {
  try {
    await fetchArtists({ orderDirection: "asc" });
    artistas.value = Artists.value.items;
    await fetchCategorias({ orderDirection: "asc" });
    categoria.value = Categorias.value.items;
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});

// Manejar visibilidad del diálogo
const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagen.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const cancel = () => {
  emit('update:visible', false);
  emit('cancel');
};

const submitForm = handleSubmit(async () => {
  const obraData = {
      titulo: titulo.value,
      descripcion: descripcion.value,
      precio: precio.value,
      artistaId: artistaId.value,
      categoriaIds: categoriaIds.value,
      imagen: imagen.value
    };
  newObra.value = obraData;
  emit('save');
  cancel();
});
</script>


<style scoped>
.p-invalid {
  border-color: var(--red-500) !important;
}

/* Estilo personalizado para el input de archivo */
.file-input-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-input-label:hover {
  border-color: var(--primary-color);
}

.file-input-label.drag-over {
  border-color: var(--primary-color);
  background-color: rgba(0, 123, 255, 0.05);
}

.file-input-text {
  margin-left: 0.5rem;
  color: #6b7280;
}
</style>