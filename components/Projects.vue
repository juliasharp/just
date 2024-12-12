<script setup lang="ts">
import { ref, onMounted } from 'vue';
const projects = ref([]);
const selectedProject = ref(null);

const config = useRuntimeConfig();
const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'get',
  query: {
    query: `
      query NewQuery {
        page(id: "6", idType: DATABASE_ID) {
          landingPage {
            projects {
              projectDate
              projectDescription
              projectMeta
              projectName
              projectImages {
                image {
                  node {
                    altText
                    link
                  }
                }
              }
            }
          }
        }
      }`
  },
  transform(data: any) {
    if (data.data.page.landingPage.projects) {
      return data.data.page.landingPage.projects.map((project) => ({
        name: project.projectName,
        description: project.projectDescription,
        meta: project.projectMeta,
        date: project.projectDate,
        images: Array.isArray(project.projectImages) ? project.projectImages.map(img => ({
          altText: img.image.node.altText,
          link: img.image.node.link
        })) : []
      }));
    } else {
      console.error("Unexpected response structure", data);
      return [];
    }
  }
});

if (error.value) {
  console.error('Error fetching data:', error.value);
} else {
  projects.value = data.value;
  if (projects.value.length > 0) {
    selectedProject.value = projects.value[0].name;
  }
}

const activeProject = ref(projects.value[0]?.name || '');
const carouselKey = ref(0);

const selectProject = (name) => {
  selectedProject.value = name;
  activeProject.value = name;
  carouselKey.value += 1; // Update the key to force re-mount
};

const settings = {
  itemsToShow: 2,
  snapAlign: 'start',
  breakpoints: {
    // 900: {
    //   itemsToShow: 3,
    // },
  }
};

const viewportWidth = ref(0);

const isSmallViewport = computed(() => viewportWidth.value <= 1180);

const handleResize = () => {
  viewportWidth.value = window.innerWidth;
};

onMounted(() => {
  viewportWidth.value = window.innerWidth;
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <div class="projects">
    <span class="square square-1"></span>
    <span class="square square-2"></span>
    <span class="square square-3"></span>
    <span class="square square-4"></span>
    <div class="projects-container">
      <div class="projects-container__inner flex">
        <div class="projects-left">
          <h3>featured projects</h3>
        </div>
        <div class="projects-center">
          <ul class="projects-names">
            <template v-if="isSmallViewport">
              <Carousel v-bind="settings">
                <Slide v-for="(project, index) in projects" :key="project.name">
                  <a @click="selectProject(project.name)" :class="{ active: activeProject === project.name }">{{ project.name }}</a>
                </Slide>
                <template #addons>
                  <Navigation class="project-arrows"/>
                </template>
              </Carousel>
            </template>
            <template v-else>
              <li v-for="(project, index) in projects" :key="projects.name" :class="{ active: activeProject === project.name }">
                <a @click="selectProject(project.name)">{{ project.name }}</a>
              </li>
            </template>
          </ul>
        </div>
        <div class="project-right">
          <div class="project-info" v-for="(project, index) in projects" :key="carouselKey" v-show="selectedProject === project.name">
            <!-- <Carousel :items-to-show="1" :wrap-around="true" :autoplay="2500" :key="project.name"> -->
              <Carousel :items-to-show="1" :wrap-around="true" :key="project.name">
              <Slide v-for="(image, imgIndex) in project.images" :key="imgIndex">
                <img class="project-img" :src="image.link" :alt="image.altText" />
              </Slide>
            </Carousel>
            <span class="project-date">{{ project.date }}</span>
            <span class="meta">{{ project.meta }}</span>
            <h5>{{ project.name }}</h5>
            <div v-if="project.description" v-html="project.description"></div>
          </div>
        </div>
      </div>
    </div>
    <span class="square square-5"></span>
    <span class="square square-6"></span>
    <span class="square square-7"></span>
    <span class="square square-8"></span>
  </div>
</template>

<style lang="scss">
.projects {
  background-color: #4D572D;
  position: relative;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: calc(100% - 40px);
    height: 1px;
    background-color: #C6F250;
    left: 20px;
  }
  &:before {
    top: 20px;
  }
  &:after {
    bottom: 20px;
  }
  &-container {
    padding: 80px 60px;
    @media (max-width: 1490px) {
      padding:  60px 60px;
    }
    @media (max-width: 1180px) {
      padding:  40px 50px;
    }
    @media (max-width: 760px) {
      padding:  40px 30px;
    }
    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 1px;
      height: calc(100% - 40px);
      background-color: #C6F250;
      top: 20px;
    }
    &:before {
      left: 20px;
    }
    &:after {
      right: 20px;
    }
    &__inner {
      @media (max-width: 1180px) {
        flex-direction: column;
      }
    }
  }
  &-left {
    flex-basis: 300px;
    flex-shrink: 0;
    position: relative;
    @media (max-width: 1600px) {
      flex-basis: 275px;
    }
    @media (max-width: 1280px) {
      flex-basis: 230px;
    }
    @media (max-width: 1180px) {
      flex-basis: 100%;
    }
    &:before {
      content: '';
      position: absolute;
      background-color: #C6F250;
      @media (min-width: 1281px) and (max-width: 1600px) {
        height: calc(100% + 80px);
        top: -40px;
        right: 35px;
        width: 1px;
      }
      @media (min-width: 1601px) {
        height: calc(100% + 120px);
        top: -60px;
        right: 35px;
        width: 1px;
      }
      @media (max-width: 1280px) {
        height: calc(100% + 80px);
        right: 10px;
        top: -40px;
        width: 1px;
      }
      @media (max-width: 1180px) {
        width: calc(100% + 60px);
        top: 120px;
        height: 1px;
        left: -30px;
      }
      @media (max-width: 760px) {
        width: calc(100% + 20px);
        left: -10px;
        top: 105px;
      }
    }
    h3 {
      font-family: "Neumatic Compressed";
      color: #C6F250;
      font-size: 140px;
      line-height: 1;
      letter-spacing: 0.01em;
      @media (max-width: 1600px) {
        font-size: 110px;
      }
      @media (max-width: 1180px) {
        font-size: 100px;
        text-align: center;
      }
      @media (max-width: 767px) {
        text-align: center;
        font-size: 85px;
      }
    }
  }
  &-center {
    //might need to fix when we add content
    margin-top: 25px;
    position: relative;
    @media (min-width: 1181px) {
      flex-basis: 365px;
      padding-right: 75px;
      padding-left: 50px;
      flex-shrink: 0;
    }
    @media (min-width: 1601px) {
      flex-basis: 465px;
      padding-left: 45px;
      padding-right: 75px;
    }
    @media (max-width: 1180px) {
      margin-top: 50px;
      margin-bottom: 70px;
    }
    @media (max-width: 760px) {
      margin-top: 40px;
      margin-bottom: 40px;
    }
    &:before {
      content: '';
      position: absolute;
      background-color: #C6F250;
      top: -85px;
      right: 80px;
      @media (min-width: 1181px) and (max-width: 1600px) {
        top: -65px;
        right: 80px;
        width: 1px;
        height: calc(100% + 104px);
      }
      @media (min-width: 1601px) {
        top: -85px;
        right: 80px;
        width: 1px;
        height: calc(100% + 144px);
      }
      @media (max-width: 1180px) {
        top: 65px;
        height: 1px;
        width: calc(100% + 60px);
        left: -30px;
      }
      @media (max-width: 760px) {
        width: calc(100% + 20px);
        left: -10px;
      }
    }
  }
  &-names {
    list-style: none;
    li {
      font-family: 'Inter Bold';
      color: #C6F250;
      font-size: 32px;
      padding-bottom: 90px;
      position: relative;
      @media (max-width: 1600px) {
        font-size: 28px;
        padding-bottom: 5.5vw;
      }
      @media (max-width: 1280px) {
        font-size: 25px;
      }
      @media (max-width: 1180px) {
        padding-bottom: 0;
      }
      @media (max-width: 900px) {
        font-size: 20px;
      }
      @media (max-width: 760px) {
        font-size: 18px;
      }
      @media (max-width: 414px) {
        font-size: 17px;
      }
      &.active {
        &:before {
          content: '';
          background: url('/src/asterisk.svg');
          width: 19px;
          height: 17.5px;
          position: absolute;
          top: 7px;
          left: -33px;
        }
      }
    }
  }
}

.projects-names a {
  position: relative;
  @media (max-width: 760px) {
    max-width: 123px;
  }
  &.active:before {
    content: '';
    background: url('/src/asterisk.svg');
    width: 19px;
    height: 17.5px;
    position: absolute;
    top: 7px;
    left: -33px;
    @media (max-width: 760px) {
      top: 4px;
      left: -25px;
    }
  }
}

.project {
  &-img {
    height: 100%;
  }
  &-date {
    font-family: 'Calling Code';
    font-size: 18px;
    position: absolute;
    background: white;
    top: 20px;
    left: 20px;
    color: black;
    padding: 5px 10px;
  }
  &-info {
    color: #C6F250;
    position: relative;
    .meta {
      font-family: 'Calling Code';
      text-transform: uppercase;
      display: block;
      margin: 40px 0 25px;
      @media (max-width: 1600px) {
        margin: 25px 0 20px;
      }
    }
    h5 {
      font-family: 'Inter Bold';
      font-size: 40px;
      margin-bottom: 34px;
      @media (max-width: 1600px) {
        font-size: 32px;
        margin-bottom: 20px;
      }
      @media (max-width: 1280px) {
        font-size: 28px;
      }
    }
    p {
      font-size: 20px;
      line-height: 1.4;
      @media (max-width: 1600px) {
        font-size: 18px;
      }
      @media (max-width: 1280px) {
        font-size: 17px;
      }
      @media (max-width: 760px) {
        font-size: 16px;
      }
    }
  }
}

.square {
  content: '';
  position: absolute;
  width: 7px;
  height: 7px;
  background: #C6F250;
  &-1 {
    top: 17px;
    left: 17px;
  }
  &-2 {
    @media (min-width: 1181px) {
      top: 17px;
      left: 276px;
    }
    @media (min-width: 1281px) {
      left: 295px;
    }
    @media (min-width: 1601px) {
      left: 321px;
    }
    @media (max-width: 1180px) {
      top: 157px;
      left: 17px;
    }
    @media (max-width: 760px) {
      top: 142px;
    }
  }
  &-3 {
    bottom: 17px;
    left: 17px;
  }
  &-4 {
    @media (min-width: 1181px) {
      left: 276px;
      bottom: 17px;
    }
    @media (min-width: 1281px) {
      left: 295px;
    }
    @media (min-width: 1601px) {
      left: 321px;
    }
    @media (max-width: 1180px) {
      right: 17px;
      top: 251px;
    }
    @media (max-width: 760px) {
      top: 227px;
    }
  }
  &-5 {
    bottom: 17px;
    right: 17px;
  }
  &-6 {
    top: 17px;
    right: 17px;
  }
  &-7 {
    @media (min-width: 1181px) {
      top: 17px;
      left: 571px;
    }
    @media (min-width: 1281px) {
      left: 616px;
    }
    @media (min-width: 1601px) {
      left: 741px;
    }
    @media (max-width: 1180px) {
      right: 17px;
      top: 157px;
    }
    @media (max-width: 760px) {
      top: 142px;
    }
  }
  &-8 {
    @media (min-width: 1181px) {
      bottom: 17px;
      left: 571px;
    }
    @media (min-width: 1281px) {
      left: 616px;
    }
    @media (min-width: 1601px) {
      left: 741px;
    }
    @media (max-width: 1180px) {
      left: 17px;
      top: 251px;
    }
    @media (max-width: 760px) {
      top: 227px;
    }
  }
}

.projects-names .carousel__track {
  @media (max-width: 1180px) {
    height: 40px;
  }
  @media (max-width: 760px) {
    height: 50px;
  }
}

.project-arrows {
  &.carousel__prev {
    left: -15px;
  }
  &.carousel__next {
    right: -15px;
  }
  svg {
    fill: #C6F250;
  }
}
</style>