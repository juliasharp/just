<script setup lang="ts">
import type { Post } from '../types/post';

const props = defineProps<{
  post: Post;
}>();

const uriLink = computed(() => {
  return `/blog/${props.post.uri}`;
});

</script>

<template>
  <NuxtLink :to='uriLink'>
    <div class="flex">
      <div>
        <h2 class="blog-title">{{ post.title }}</h2>
        <p class="date">{{ new Date(post.date).toLocaleDateString() }}</p>
        <ul class="categories">
          <li v-for="category in post.categories.nodes" :key="category.name">
            {{ category.name }}
          </li>
        </ul>
        <article v-html="post.excerpt" class="excerpt"></article>
      </div>
    </div>
  </NuxtLink>
</template>