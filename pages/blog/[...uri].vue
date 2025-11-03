<script setup>

const route = useRoute();
const uri = route.params.uri.join('/');
const config = useRuntimeConfig();
const {data, pending, refresh, error} = await useFetch(config.public.wordpressUrl, {
  method: 'get',
  query: {
      query: `
      query MyQuery3($uri: String!) {
          nodeByUri(uri: $uri) {
              ... on Post {
                  id
                  title
                  date
                  content
              }
          }
      }
      `,
      variables: {
          uri: uri
      }
  },
  transform(data){
      return data.data.nodeByUri
  }
})


useHead({
  title: data.value.title
})
</script>

<template>
  <NuxtLayout name="default" page-name="home" :title="`JUST Design | ${data.title || 'Blog'}`">
    <main>
        <h1 class="post-title">{{ data.title }}</h1>
        <div class="post-date">{{ new Date(data.date).toLocaleDateString() }}</div>
        <article class="post-content" v-html="data.content"></article>
    </main>
  </NuxtLayout>
</template>