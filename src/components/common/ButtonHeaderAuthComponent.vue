<script setup lang="ts"></script>
<template>
  <a class="hover:text-blue-400 relative font-semibold group text-md py-4 duration-150">
    <slot name="text"> </slot>
    <div
      class="absolute -bottom-4 flex opacity-0 duration-200 group-hover:opacity-100 justify-center items-center w-full"
    >
      <span class="rounded-full w-full shadow-[0px_0px_35px_10px_#60a5fa] absolute"> </span>
    </div>
  </a>
</template>
