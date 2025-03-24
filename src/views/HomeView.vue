<script setup lang="ts">
import Lake from '@/assets/images/360_F_112961719_Vt2e6Smde3oKIMxYYHmGzr46R9zwsTiE.jpg'
import Canon from '@/assets/images/PCA_40301_Q1-Invite_DP.jpg'
import SectionSlide from '@/views/Home/SectionSlide.vue'

const mySections = [
  {
    title: 'Exteriores',
    description: 'Las fotos en la ciudad capturan la magia del exterior: la luz filtrándose entre edificios, las sombras danzando en las calles y el vibrante pulso urbano bajo el cielo abierto. Cada imagen es un instante efímero convertido en arte.',
    image:
      'https://www.mossadams.com/getmedia/631f865e-dd94-44a6-89f9-6bf9353ac6ac/PCA_40301_Q1-Invite_DP.jpg?width=720&height=480&ext=.jpg',
    bgColor: 'bg-white',
    txColor: 'text-[#C25500]',
    StxColor: 'text-[#F4811B]'
  },
  {
    title: 'Interiores',
    description: '"Las fotos en interiores encierran la magia de los espacios que cuentan historias: la luz tenue de una biblioteca, el susurro de las páginas, la calidez de un café. Cada imagen captura la esencia de lo íntimo, donde el tiempo parece detenerse."',
    image:
      'https://www.mossadams.com/getmedia/631f865e-dd94-44a6-89f9-6bf9353ac6ac/PCA_40301_Q1-Invite_DP.jpg?width=720&height=480&ext=.jpg',
    bgColor: 'bg-[#F4811B]',
    txColor: 'text-white',
    StxColor: 'text-[#FFFFFF]'
  },
  {
    title: 'Conexión con\n' +
      'la naturaleza',
    description: '"Las fotos en la naturaleza son un respiro para el alma. Capturan la caricia del viento, el murmullo de los árboles y la danza de la luz entre las hojas. Cada imagen es un puente que nos une con la esencia pura del mundo natural."',
    image:
      'https://www.mossadams.com/getmedia/631f865e-dd94-44a6-89f9-6bf9353ac6ac/PCA_40301_Q1-Invite_DP.jpg?width=720&height=480&ext=.jpg',
    bgColor: 'bg-[#E64902]',
    txColor: 'text-white',
    StxColor: 'text-[#FFFFFF]'
  },
  {
    title: 'Urbano',
    description: '"Las fotos en la naturaleza son un respiro para el alma. Capturan la caricia del viento, el murmullo de los árboles y la danza de la luz entre las hojas. Cada imagen es un puente que nos une con la esencia pura del mundo natural."',
    image:
      'https://www.mossadams.com/getmedia/631f865e-dd94-44a6-89f9-6bf9353ac6ac/PCA_40301_Q1-Invite_DP.jpg?width=720&height=480&ext=.jpg',
    bgColor: 'bg-[#000000]',
    txColor: 'text-white',
    StxColor: 'text-[#FFFFFF]'

  }
]
</script>

<template>
  <div class="relative w-full bg-[#EEE9DF]">
    <section class="flex flex-col items-center justify-center py-5">
      <h1 class="text-4xl text-center my-2 font-montserrat">Bienvenido a Galeria</h1>
      <div class="relative pt-4 px-3 md:px-0 md:w-[80%] mx-auto">
        <img
          :src="Lake"
          alt="lago de inicio"
          class="md:w-[70%] md:h-[50%] object-cover rounded-lg shadow-md mx-auto"
        />
        <img
          :src="Canon"
          alt="lago de inicio"
          class="md:w-[25%] h-[50%] object-cover rounded-lg shadow-md mx-auto absolute -bottom-10 right-2 md:-bottom-20 md:right-20"
        />
      </div>
    </section>
    <div class="flex justify-center pt-4 md:pt-15 pb-5">
      <h1 class="flex mt-5 text-center my-auto text-[#C25500] font-light text-3xl">
        CAPTURA EMOCIONES, DECORA HISTORIAS
      </h1>
    </div>
    <div class="relative w-full bg-[#EEE9DF] pb-8 h-auto">
      <SectionSlide :sections="mySections" />
    </div>
  </div>
</template>

<style scoped></style>
