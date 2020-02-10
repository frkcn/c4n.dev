<template>
  <article>
    <header>
      <h1 class="text-5xl font-extrabold m-xs-b-6 no-line-height tight-letters">
        {{ post.attributes.title }}
      </h1>
      <p class="text-sm font-silent">
        {{ post.attributes.date }}
      </p>
    </header>
    <div v-html="post.html" class="markdown" />
  </article>
</template>
<script>
export default {
  async asyncData ({ params }) {
    const post = await import(`~/content/articles/${params.slug}.md`)
    return { post }
  },
  head () {
    return {
      title: this.post.attributes.title,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.post.attributes.short
      }],
      link: [{
        rel: 'canonical',
        href: 'https://c4n.dev' + this.post.attributes.slug
      }]
    }
  }
}
</script>
