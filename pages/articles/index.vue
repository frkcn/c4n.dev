<template>
  <div>
    <h1 class="text-2xl font-extrabold text-black mb-4">
      Articles
    </h1>
    <div class="text-lg text-grey-darkest leading-normal spaced-y-6">
      <p>Articles about programming, technology, caligraphy and all my interests.</p>
    </div>
    <div class="mt-12 spaced-y-10">
      <div v-for="post in posts" :key="post.attributes.title">
        <div>
          <nuxt-link :to="'/articles' + post.attributes.slug" class="text-lg text-black font-bold no-underline hover:underline">
            {{ post.attributes.title }}
          </nuxt-link>
          <p class="text-grey-darkest text-base leading-normal mt-1 mb-6">
            {{ post.attributes.short }}
          </p>
          <div class="text-grey-darkest text-base leading-normal mt-2">
            <nuxt-link
              :to="'/articles' + post.attributes.slug"
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
import moment from 'moment'

export default {
  async asyncData () {
    const resolve = await require.context('~/content/articles/', true, /\.md$/)
    const imports = resolve.keys().map(key => resolve(key))
    // sort by date
    imports.sort((a, b) =>
      moment(b.attributes.date, 'DD/MM/YYYY').diff(moment(a.attributes.date, 'DD/MM/YYYY'))
    )
    return { posts: imports }
  }
}
</script>
