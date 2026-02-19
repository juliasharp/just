<script setup lang="ts">

</script>

<template>
  <div class="home-design-journey-wrapper res-gutter">
    <div class="home-design-journey flex justify-center">
      <p class="body-font-medium relative">Book your discovery call <a class="body-font-bold underline-animation" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0vOk-6SjMEuI785o1Cw9aw_nwkd5eBN3zxngmob9FFca2AKM1Wt9f2O-0UusulfQ5BV88auueL" target="_blank">here</a>.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-design-journey {
  padding: 42px 0;
  text-align: center;
  @media (min-width: 768px) {
    border-top: 1px solid #000000;
  }
  @media (min-width: 1181px) {
    padding: 72px 0;
  }
  p {
    font-size: clamp(33px, 4.5vw, 70px);
  }
  a {
    &:after {
      height: 3px;
      bottom: 4px;
      @media (min-width: 991px) {
        bottom: 10px;
      }
      @media (min-width: 1281px) {
        bottom: 13px;
        height: 4px;
      }
    }
  }
}
</style>