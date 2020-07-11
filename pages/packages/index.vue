<template>
  <div>
    <h1 class="text-2xl font-extrabold text-black mb-4">
      Packages
    </h1>
    <div class="text-lg text-grey-darkest leading-normal spaced-y-6">
      <p>Open source packages created by me.</p>
    </div>
    <div class="mt-12 spaced-y-10">
      <div v-for="pkg in packages" :key="pkg.title">
        <div>
          <nuxt-link :to="'/packages/' + pkg.slug" class="text-lg text-black font-bold no-underline hover:underline">
            {{ pkg.title }}
          </nuxt-link>
          <p class="text-grey-darkest text-base leading-normal mt-1 mb-6">
            {{ pkg.description }}
          </p>
          <div class="text-grey-darkest text-base leading-normal mt-2">
            <nuxt-link
              :to="'/packages/' + pkg.slug"
              class="text-grey-darker hover:text-black text-sm no-underline hover:underline"
            >
              Read documentation →
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  async asyncData ({ $content, params, error }) {
    const packages = await $content('packages')
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Packages not found' })
      })

    return {
      packages
    }
  }
}
</script>
