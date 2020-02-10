<template>
  <div class="relative z-20 flex justify-between items-center">
    <div class="flex md:block lg:flex items-center max-w-full">
      <div class="mb-0 md:mb-4 lg:mb-0 flex flex-no-shrink pr-4 md:pr-6 lg:pr-12">
        <a href="/" class="flex items-end no-underline">
          <img src="/logo.svg" alt="" class="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
        </a>
      </div>
      <div>
        <nuxt-link to="/" class="block text-black no-underline font-bold text-xl lg:text-3xl font-extrabold leading-none lg:leading-tight">
          Faruk Can
        </nuxt-link>
        <div class="hidden md:flex mt-1 lg:mt-2 uppercase tracking-wide text-xs spaced-x-6">
          <nuxt-link to="/" class="text-gray-700 font-semibold mr-5">
            About
          </nuxt-link>
          <nuxt-link to="/articles" class="text-gray-700 font-semibold">
            Articles
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
</style>
