<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig();
const { data, refresh, pending } = await useFetch(config.public.wordpressUrl, {
 method: 'get',
 query: {
   query: `
     query NewQuery {
      posts {
        nodes {
          title
          date
          categories {
            nodes {
              name
            }
          }
          author {
            node {
              name
            }
          }
          excerpt
          uri
        }
      }
    }`
  },
  transform(data) {
    // Define a proper type to handle the nested structure
    type Post = {
      title: string;
      date: string;
      categories: {
        nodes: Array<{
          name: string;
        }>;
      };
      excerpt: string;
      uri: string;
    };

    // Ensure the data matches the expected type
    return data.data.posts.nodes as Array<Post>;
  }
});
</script>

<template>
  <NuxtLayout name="default" page-name="home" title="JUST Design | Blog">
    <div id="blog">
      <Post 
        v-for="post in data" 
        :key="post.uri" 
        :post="post" 
        class="blog-entry">
      </Post>
    </div>
  </NuxtLayout>
</template>