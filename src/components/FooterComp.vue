<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <footer class="footer-clean bg-[#F4811B] text-white py-10">
    <div class="container mx-auto px-6 w-full flex flex-col items-center">


      <div class="flex justify-center mt-6">
        <div class="flex space-x-4">
          <a href="#" class="text-2xl"><Icon icon="ion:social-facebook" /></a>
          <a href="#" class="text-2xl"><Icon icon="ion:social-twitter" /></a>
          <a href="#" class="text-2xl"><Icon icon="ion:social-snapchat" /></a>
          <a href="#" class="text-2xl"><Icon icon="ion:social-instagram" /></a>
        </div>
      </div>

      <p class="text-sm text-center mt-4">&copy; 2025 Galería™. Todos los derechos reservados.</p>

    </div>
  </footer>
</template>



<style scoped>
.footer-clean {
  width: 100%;
  background: #F4811B;
  padding: 20px 50px;
}

ul {
  list-style: none;
  padding: 0;
}

a {
  color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
