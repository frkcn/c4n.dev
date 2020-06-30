<template>
  <article>
    <header class="mb-8">
      <h1 class="text-5xl font-extrabold m-xs-b-6 no-line-height tight-letters">
        {{ page.title }}
      </h1>
      <div class="flex justify-between">
        <p class="text-sm font-silent">
          {{ page.date }}
        </p>
        <p class="text-sm font-silent">
          {{ Math.ceil(page.readingTime / 60000) }} min read
        </p>
      </div>
    </header>
    <nuxt-content :document="page" />
  </article>
</template>
<script>
export default {
  async asyncData ({ $content, params, error }) {
    const slug = params.slug
    const page = await $content('articles/' + slug)
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Page not found' })
      })

    return {
      page
    }
  }
}
</script>
