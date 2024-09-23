<script setup lang="ts">
const testimonials = ref([]);

const config = useRuntimeConfig();

const encodedQuery = encodeURIComponent(`
  query NewQuery {
    page(id: "6", idType: DATABASE_ID) {
      landingPage {
        testimonials {
          authorName
          quote
          authorTitlw
        }
      }
    }
  }
`);

const { data, error } = await useFetch(`${config.public.wordpressUrl}?query=${encodedQuery}`, {
  method: 'get',
  transform: (data) => {
    if (data?.data?.page?.landingPage?.testimonials) {
      return data.data.page.landingPage.testimonials.map((testimonial) => ({
        quote: testimonial.quote,
        author: testimonial.author,
        authorTitle: testimonial.authorTitlw,
      }));
    } else {
      console.error("Unexpected response structure for team", data);
      return [];
    }
  }
});

if (error.value) {
  console.error('Error fetching team data:', error.value);
} else {
  testimonials.value = data.value;
}

const settings = {
  itemsToShow: 1,
  autoplay: 6000,
  wrapAround: true,
  easing:"linear",
  transition: 400,
  // pauseAutoplayOnHover: true,
  mouseDrag: false,
  touchDrag: true,
};
</script>

<template>
  <div class="testimonials">
    <div class="testimonials-container">
      <div class="testimonial-outer">
        <Carousel v-bind="settings">
          <Slide v-for="(testimonial, index) in testimonials" :key="index" class="team-slide">
            <transition name="fade"  mode="out-in">
              <div class="testimonial-slide">
                <p class="quote">{{ testimonial.quote }}</p>
                <div class="author">
                  <span class="author-name">{{ testimonial.author }}</span>
                  <span class="author-title">{{ testimonial.authorTitle }}</span>
                </div>
              </div>
            </transition>
          </Slide>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .fade-enter-active, .fade-leave-active {
//   transition: opacity 0.5s ease;
// }
// .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
//   opacity: 0;
// }
// .carousel__track {
//   transition: none !important; /* Disable sliding transition */
// }

// .carousel__slide {
//   opacity: 0;
//   transition: opacity 1s ease-in-out;
// }

// /* Ensure the current active slide fades in */
// .carousel__slide[aria-hidden="false"] {
//   opacity: 1;
// }

.testimonials {
  background: #000;
  color: #FFFFFF;
  &-container {
    max-width: 1700px;
    padding: 0 50px;
    margin: 20px auto 80px;
    position: relative;
    @media (max-width: 760px) {
      padding: 0 40px;
    }
    &:before {
      content: '';
      width: 55px;
      height: 10px;
      background: #E838BB;
      position: absolute;
      bottom: 0;
      right: 50px;
      @media (max-width: 760px) {
        right: 40px;
        width: 40px;
        height: 8px;
      }
    }
    &:after {
      content: '';
      width: 10px;
      height: 55px;
      background: #E838BB;
      position: absolute;
      right: 50px;
      bottom: 10px;
      @media (max-width: 760px) {
        right: 40px;
        width: 8px;
        height: 40px;
        bottom: 8px;
      }
    }
  }
}

.testimonial {
  &-outer {
    &:before {
      content: '';
      width: 55px;
      height: 10px;
      background: #E838BB;
      position: absolute;
      @media (max-width: 760px) {
        width: 40px;
        height: 8px;
      }
    }
    &:after {
      content: '';
      width: 10px;
      height: 55px;
      background: #E838BB;
      position: absolute;
      top: 10px;
      @media (max-width: 760px) {
        width: 8px;
        height: 40px;
        top: 8px;
      }
    }
  }
  &-slide {
    padding: 72px 95px;
    text-align: left;
    position: relative;
    @media (max-width: 1000px) {
      padding: 50px 60px;
    }
    @media (max-width: 760px) {
      padding: 20px 20px 20px 40px;
    }
  }
}

.quote {
  font-size: 50px;
  line-height: 1.4;
  font-family: 'Inter Bold';
  position: relative;
  padding-bottom: 78px;
  @media (max-width: 1600px) {
    font-size: 40px;
  }
  @media (max-width: 1400px) {
    font-size: 32px;
  }
  @media (max-width: 760px) {
    font-size: 20px;
    padding-bottom: 45px;
  }
  &:after {
    content: '';
    width: 110px;
    height: 10px;
    background: #C6F250;
    position: absolute;
    bottom: 35px;
    left: 0;
    @media (max-width: 1400px) {
      width: 90px;
    }
    @media (max-width: 760px) {
      width: 70px;
      height: 7px;
      bottom: 22px;
    }
  }
}

.author {
  span {
    display: block;
    &:first-of-type {
      font-family: 'Inter Bold';
      font-size: 30px;
      @media (max-width: 1400px) {
        font-size: 25px;
      }
      @media (max-width: 760px) {
        font-size: 18px;
      }
    }
    &:last-of-type {
      font-family: "Calling Code";
      text-transform: uppercase;
      margin-top: 15px;
      @media (max-width: 760px) {
        font-size: 14px;
        margin-top: 6px;
      }
    }
  }
}
</style>