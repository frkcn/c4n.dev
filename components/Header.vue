<template>
  <div>
    <div class="relative z-20 flex justify-between items-center">
      <div class="flex md:block lg:flex items-center max-w-full">
        <div class="mb-0 md:mb-4 lg:mb-0 flex flex-no-shrink pr-4 md:pr-6 lg:pr-8">
          <a href="/" class="flex items-end no-underline">
            <img src="/logo.svg" alt="" class="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
          </a>
        </div>
        <div>
          <nuxt-link to="/" class="block text-black no-underline font-bold text-xl lg:text-3xl font-extrabold leading-none lg:leading-tight">
            Faruk Can
          </nuxt-link>
          <div class="hidden md:flex mt-1 lg:mt-6 uppercase tracking-wide text-xs">
            <nuxt-link to="/" class="text-gray-700 font-semibold mr-5 hover:text-black">
              About
            </nuxt-link>
            <nuxt-link to="/articles" class="text-gray-700 font-semibold mr-5 hover:text-black">
              Articles
            </nuxt-link>
            <nuxt-link to="/packages" class="text-gray-700 font-semibold hover:text-black">
              Packages
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="block md:hidden">
        <button v-show="!isOpen" class="block" @click="open">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="text-black h-6 w-6">
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
        <button v-show="isOpen" @click="close">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="text-black h-6 w-6">
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>
    </div>
    <div v-if="isOpen" class="md:hidden z-10 bg-white fixed inset-0 pt-24 block">
      <div class="overflow-y-auto py-8 px-12 max-h-full overflow-y-auto">
        <a href="/" class="block text-black font-bold no-underline mb-8">
          About
        </a>
        <a href="/articles" class="block text-black font-bold no-underline">
          Articles
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isOpen: false
    }
  },
  watch: {
    isOpen: {
      immediate: false,
      handler (isOpen) {
        if (isOpen) {
          document.body.style.setProperty('overflow', 'hidden')
        } else {
          document.body.style.removeProperty('overflow')
        }
      }
    }
  },
  mounted () {
    this.isOpen = false
  },
  methods: {
    open () {
      this.isOpen = true
      this.$nextTick(() => {
        this.$refs.closeButton.focus()
      })
    },
    close () {
      this.isOpen = false
      this.$nextTick(() => {
        this.$refs.openButton.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
