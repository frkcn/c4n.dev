<template>
  <div class="flex justify-center min-h-screen bg-white text-black dark:bg-black-dark dark:text-white">
    <div class="container">
      <div class="py-8 lg:py-16 px-6 md:px-16 lg:px-24">
        <Header />
        <div class="lg:pl-32 mt-12">
          <div class="">
            <nuxt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>

<style>
</style>
