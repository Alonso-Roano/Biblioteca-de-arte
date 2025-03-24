<template>
    <div class="m-2">
      <div class="flex w-full justify-between mb-1.5">
        <h2 class="block text-3xl text-black p-2 font-semibold">Errores en Logs - {{ totalRecords }} en total</h2>
        <div @click="$emit('add-LogError')"
          class="flex items-center gap-0.5 rounded-md py-0.5 px-1 bg-blue-500 text-white w-fit font-semibold ml-1 my-1 cursor-pointer">
          <IconPlus class="size-4" />
          <button>Añadir</button>
        </div>
      </div>
      <SearchDashboard @filter-change="applyFilters" :url="'logError.filtrar'"/>
      <DataTable :value="LogErrorsShow" tableStyle="min-width: 50rem" @page="onPageChange">
        <Column field="source" header="Recurso"></Column>
        <Column field="message" header="Mensaje" :style="{ 'max-width': '300px', 'overflow': 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }"></Column>
        <Column field="stackTrace" header="Seguimiento" :style="{ 'max-width': '300px', 'overflow': 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }"></Column>
        <Column header="Acciones">
          <template #body="props">
            <span class="block">
              <Button icon="pi pi-eye" variant="text" rounded aria-label="Ver" @click="$emit('view-LogError', props.data)">
                <Icon icon="akar-icons:info-fill" width="24" height="24" />
              </Button>
              <Button icon="pi pi-pencil" variant="text" severity="info" rounded aria-label="Editar"
                @click="$emit('edit-LogError', props.data)">
                <Icon icon="mdi:pencil-outline" width="24" height="24" />
              </Button>
              <Button icon="pi pi-trash" severity="danger" variant="text" rounded aria-label="Eliminar"
                @click="$emit('delete-LogError', props.data.id)">
                <Icon icon="material-symbols:delete" width="24" height="24" />
              </Button>
            </span>
          </template>
        </Column>
      </DataTable>
      <Paginator :rows="rows" :totalRecords="totalRecords"  @page="onPageChange" :rowsPerPageOptions="[5, 10, 20, 50]"/>
    </div>
</template>
  
<script setup lang="ts">
  // @ts-ignore
  import SearchDashboard from '@/components/dashboard/SearchDashboard.vue'
  import { Button } from 'primevue'
  import { Icon } from "@iconify/vue"
  import IconPlus from '@/components/icons/IconPlus.vue'
  
  import { watch, ref } from "vue";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import Paginator from "primevue/paginator";
  import { LogErrors, fetchLogErrors } from "@/composables/logErrorFunctions";
  
  const page = ref(1);
  const rows = ref(5);
  const limit = ref(5);
  const filters = ref({});

  const LogErrorsShow = ref([]);
  const totalRecords = ref(0);

  const applyFilters = (newFilters:any) => {
    filters.value = newFilters;
  };

  const loadLogErrors = async () => {
    await fetchLogErrors({ 
      ...filters.value, 
      page: page.value, 
      limit: limit.value 
    });
  };

  watch(LogErrors, (newLogErrors) => {
    console.log(LogErrors.value)
    const Usuarios = <any> newLogErrors;
    LogErrorsShow.value = Usuarios.items;
    totalRecords.value = Usuarios.total;
  }, { deep: true });

  watch([filters, page, limit], loadLogErrors, { immediate: true });
  
  const onPageChange = (event:any) => {
    page.value = event.page + 1;
    limit.value = event.rows;
    loadLogErrors();
  }
</script>