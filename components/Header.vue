<script setup lang="ts">

</script>

<template>
  <div class="header-container">
    <div class="header">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  //background: gray;
  z-index: 10;
  content: '';
  &-container {
    display: block;
    position: relative;
    height: 100vh;
  }
}
</style>