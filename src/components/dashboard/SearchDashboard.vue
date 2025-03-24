<script setup>
import { ref, watch, defineEmits } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";

import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import { apiRequest } from "@/api/apiClient";

const toast = useToast();
const emit = defineEmits(["filter-change"]);
const url = defineProps(["url"])

const orderBy = ref(null);
const orderDirection = ref("asc");
const startDate = ref(null);
const endDate = ref(null);
const filterField = ref(null);
const filterValue = ref("");

const orderFields = ref([]);
const filterFields = ref([]);
const relationFields = ref([]);
const showFilters = ref(false);

const extractFields = (data) => {
  if (!data || data.length === 0) return;

  const sample = data[0];
  const excludedFields = ["idApplicationUser", "isDeleted", "fechaNacimiento"];

  orderFields.value = Object.keys(sample).filter(
    (key) => !excludedFields.includes(key) && sample[key] !== null
  );

  filterFields.value = [...orderFields.value];

  relationFields.value = Object.keys(sample).filter(
    (key) => key.toLowerCase().includes("id") && !excludedFields.includes(key)
  );
};

const fetchFields = async () => {
  try {
    const { data } = await apiRequest(url.url, { page:1, limit: 1 });
    extractFields(data.items);
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "No se pudieron obtener los campos de filtrado", life: 3000 });
  }
};

const applyFilters = () => {
  emit("filter-change", {
    orderBy: orderBy.value || undefined,
    orderDirection: orderDirection.value,
    startDate: startDate.value ? startDate.value.toISOString() : undefined,
    endDate: endDate.value ? endDate.value.toISOString() : undefined,
    filterField: filterField.value || undefined,
    filterValue: filterValue.value || undefined,
  });
};

watch([orderBy, orderDirection, startDate, endDate, filterField, filterValue], applyFilters, { immediate: true });

fetchFields();
</script>

<template>
  <div class="mb-4">

    <Button :label="showFilters?'Ocultar Filtros':'Mostrar Filtros'" @click="showFilters = !showFilters" class="mb-3" ></Button>

    <div v-if="showFilters" class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 shadow rounded bg-gray-100">
      <Dropdown v-model="orderBy" :options="orderFields" placeholder="Ordenar por" class="w-full" />
      <Dropdown v-model="orderDirection" :options="[{ label: 'Orden ascendente', value: 'asc' }, { label: 'Orden descendente', value: 'desc' }]" optionLabel="label" optionValue="value" placeholder="Dirección" class="w-full" />
      <Calendar v-model="startDate" placeholder="Fecha inicio" showIcon dateFormat="yy-mm-dd" class="w-full" />
      <Calendar v-model="endDate" placeholder="Fecha fin" showIcon dateFormat="yy-mm-dd" class="w-full" />
      <Dropdown v-model="filterField" :options="filterFields" placeholder="Filtrar por campo" class="w-full" />
      <InputText v-model="filterValue" placeholder="Valor del filtro" class="w-full" />
    </div>
  </div>
</template>
