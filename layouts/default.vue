<template>
  <div class="py-8 lg:py-16 px-6 md:px-16 lg:px-24">
    <Header />
    <nuxt />
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
