<template>
  <article>
    <header class="mb-8">
      <h1 class="text-5xl font-extrabold m-xs-b-6 no-line-height tight-letters">
        {{ pkg.title }}
      </h1>
    </header>
    <nuxt-content :document="pkg" />
  </article>
</template>
<script>
export default {
  async asyncData ({ $content, params, error }) {
    const slug = params.slug
    const pkg = await $content('packages/' + slug)
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Package not found' })
      })

    return {
      pkg
    }
  }
}
</script>
