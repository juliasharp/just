<script setup lang="ts">
const isMobileNavOpen = ref(false);

const onBurgerClick = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
}

const closeMobileMenu = () => {
  isMobileNavOpen.value = false;
}
</script>

<template>
  <div :class="isMobileNavOpen ? 'mobile-nav-open' : ''" class="Header has-transition">
    <div class="Header-navWrapper">
      <nav class="Header-nav">
        <ul class="Header-navList">
          <li class="Header-navItem">
            <NuxtLink @click="closeMobileMenu" class="Header-navLink" to="/gateway">
              <span class="Header-navLinkText">Home</span>
            </NuxtLink>
          </li>
          <li class="Header-navItem">
            <NuxtLink @click="closeMobileMenu" class="Header-navLink" to="/">
              <span class="Header-navLinkText">Consulting</span>
            </NuxtLink>
          </li>
          <li class="Header-navItem">
            <NuxtLink @click="closeMobileMenu" class="Header-navLink" to="/residential">
              <span class="Header-navLinkText">Residential</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>