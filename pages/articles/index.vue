<template>
  <div>
    <h1 class="text-2xl font-extrabold text-black mb-4">
      Articles
    </h1>
    <div class="text-lg text-grey-darkest leading-normal spaced-y-6">
      <p>Articles about programming, technology, caligraphy and all my interests.</p>
    </div>
    <div class="mt-12 spaced-y-10">
      <div v-for="article in articles" :key="article.title">
        <div>
          <nuxt-link :to="'/articles/' + article.slug" class="text-lg text-black font-bold no-underline hover:underline">
            {{ article.title }}
          </nuxt-link>
          <p class="text-grey-darkest text-base leading-normal mt-1 mb-6">
            {{ article.description }}
          </p>
          <div class="text-grey-darkest text-base leading-normal mt-2">
            <nuxt-link
              :to="'/articles/' + article.slug"
              class="text-grey-darker hover:text-black text-sm no-underline hover:underline"
            >
              Read this article →
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
    const articles = await $content('articles')
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Articles not found' })
      })

    return {
      articles
    }
  }
}
</script>
