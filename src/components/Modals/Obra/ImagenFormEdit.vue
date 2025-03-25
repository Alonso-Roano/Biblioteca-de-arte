<template>
    <Dialog
      :visible="localVisible"
      @update:visible="emitImage"
      header="Editar imagen"
      :modal="true"
      style="background-color: #fff; width: 500px; max-width: 100%; margin-inline: 20px;"
    >
      <div class="flex flex-col gap-4">
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
  import * as nsfwjs from 'nsfwjs';
  import { Dialog, InputText, Button, InputNumber, Dropdown, MultiSelect, Textarea } from 'primevue';
  import { newObra, createObra, ObraImage } from '@/composables/obraFunctions';
  import { Artists, fetchArtists } from '@/composables/artistaFunctions';
  import { Categorias, fetchCategorias } from '@/composables/categoriaFunctions';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
    Obra:{
      type: Object,
      required: true,
    }
  });
  
  const emit = defineEmits(['cancel', 'save', 'update:visible']);
  
  const loading = ref(false);
  const artistas = ref([]);
  const categoria = ref([]);
  const previewImage = ref('');
  
  const schema = yup.object({
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
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    imagen.value = file;
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      previewImage.value = e.target.result;

      const img = new Image();
      img.src = e.target.result;
      
      img.onload = async () => {
        try {
          // Cargar el modelo predeterminado (MobileNetV2)
          const model = await nsfwjs.load();
          
          // Clasificar la imagen
          const predictions = await model.classify(img);
          
          // Verificar contenido NSFW (Porn, Hentai, Sexy) con un umbral
          const nsfwDetected = predictions.some(prediction => 
            (prediction.className === 'Porn' || 
            prediction.className === 'Hentai' || 
            prediction.className === 'Sexy') && 
            prediction.probability > 0.7
          );
          
          if (nsfwDetected) {
            errors.imagen = 'La imagen contiene contenido inapropiado.';
            imagen.value = null; 
            previewImage.value = '';
          } else {
            errors.imagen = '';
          }
        } catch (error) {
          console.error('Error al verificar la imagen:', error);
          // Opcional: Mostrar un mensaje al usuario
          errors.imagen = 'Error al procesar la imagen. Inténtalo de nuevo.';
        }
      };
      
      img.onerror = () => {
        console.error('Error al cargar la imagen');
        errors.imagen = 'La imagen no se pudo cargar.';
      };
    };
    
    reader.onerror = () => {
      console.error('Error al leer el archivo');
      errors.imagen = 'Error al leer el archivo.';
    };
    
    reader.readAsDataURL(file);
  };
  
  const cancel = () => {
    emit('update:visible', false);
    emit('cancel');
  };
  
  const emitImage = (value: boolean) => {
      emit('update:visible', value);
    };
  
  const submitForm = handleSubmit(async () => {
    const obraData = {
        imagen: imagen.value
      };
    ObraImage.value = obraData;
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