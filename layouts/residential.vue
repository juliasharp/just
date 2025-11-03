<script setup>

const props = defineProps({
  title: String,
  pageName: String
});

onMounted(() => {
  document.body.classList.add('residential')
})

onBeforeUnmount(() => {
  document.body.classList.remove('residential')
})

</script>

<template>
  <div id="viewport" :class="`page ${props.pageName}`">
    <slot />
  </div>
</template>