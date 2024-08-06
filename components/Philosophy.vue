<script setup lang="ts">

const initAnimations = () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: '.philosophy',
      start: 'top top',
      end: window.innerHeight + ' top',
      pin: true,
      pinSpacing: true,
      scrub: 0.2,
      // markers: true,
    }
  });

  // Add fade-in animation for the h2 element
  gsap.from('.philosophy-text h2', {
    opacity: 0,
    y: 5, // Slight upward motion for a more dynamic effect
    duration: 2,
    ease: 'ease-in-out',
    delay: 1,
    scrollTrigger: {
      trigger: '.philosophy-text h2',
      start: 'top 60%', // Adjust this value based on when you want the fade to star
      toggleActions: 'play none none none', // Play the animation once when the trigger is hit
      // markers: true,
    }
  });

  ScrollTrigger.normalizeScroll(true);
}

onMounted(() => {
  initAnimations();
});
</script>

<template>
  <div class="philosophy section-with-title">
    <div class="philosophy-container">
      <div class="philosophy-text">
        <h2><span>JUST</span> is a creative agency of activists and experts, designing equitable futures <span>NOW</span> !</h2>
        <div class="text-inner">
          <SectionTitle title="philosophy // approach" color="pink"></SectionTitle>
          <p>Unjust systems have been by design - they can and must be redesigned!</p>
          <p>Our design approach is rooted in an understanding of the essential dynamics that foster healthy, equitable, and resilient projects - empowering our clients and outcomes by:</p>
          <ul>
            <li>Broadening awareness of what projects can and should be responsible for</li>
            <li>Uncovering and surfacing opportunities</li>
            <li>Providing tools to scaffold agency and culture</li>
            <li>Cultivating stewardship of Mother Earth</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.philosophy {
  position: relative;
  height: 100vh;
  background: #400A82;
  @media (min-width: 1601px) {
    padding-top: 85px;
  }
  &-container {
    padding-left: 80px;
    padding-right: 80px;
    max-width: 1825px;
    @media (max-width: 767px) {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
  &-text {
    @media (min-width: 1280px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: calc(100vh - 150px);
    }
    @media (min-width: 1601px) {
      height: calc(100vh - 200px);
    }
    h2 {
      opacity: 1; /* Ensure it starts fully visible post-animation */
      transform: translateY(0);
      color: #ffffff;
      font-size: 3.6vw;
      line-height: 1.21;
      margin-bottom: 75px;
      @media (max-width: 1600px) {
        font-size: 3.5vw;
      }
      @media (max-width: 760px) {
        font-size: 22px;
        margin-bottom: 35px;
      }
      span {
        font-family: 'Inter Bold';
      }
    }
  }
}

.section-title {
  margin-bottom: 40px;
}

.text-inner {
  color: #FFFFFF;
  font-size: 2.5vw;
  @media (max-width: 760px) {
    font-size: 16px;
  }
  p:last-of-type {
    margin-top: 30px;
  }
  ul {
    margin-top: 38px;
    margin-left: 26px;
    font-size: 2vw;
    @media (max-width: 760px) {
    font-size: 16px;
  }
    li:not(:first-of-type) {
      margin-top: 15px;
    }
  }
}
</style>