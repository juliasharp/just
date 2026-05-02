<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';
import { ref, computed } from 'vue';

const componentRef = ref(null);
const team = ref([]);
const selectedTeamMember = ref(null);
const activeProfileHover = ref(null);
const carouselTrackRef = ref(null);

const isMobile = ref(false);
const viewportCols = ref(5);

const updateViewportState = () => {
  if (typeof window === 'undefined') return;
  const w = window.innerWidth;
  isMobile.value = w <= 760;
  const count = team.value.length;
  const maxCols = w > 1280 ? count : 4;
  viewportCols.value = count > 0 ? Math.min(count, maxCols) : maxCols;
};

const config = useRuntimeConfig();

const encodedQuery = encodeURIComponent(`
  query NewQuery {
    page(id: "6", idType: DATABASE_ID) {
      landingPage {
        team {
          name
          role
          bioPic {
            node {
              altText
              link
            }
          }
          mobileBioPic {
            node {
              link
              altText
            }
          }
          bio
        }
      }
    }
  }
`);

const { data, error } = await useFetch(`${config.public.wordpressUrl}?query=${encodedQuery}`, {
  method: 'get',
  transform: (data) => {
    if (data?.data?.page?.landingPage?.team) {
      return data.data.page.landingPage.team.map((member) => ({
        name: member.name,
        role: member.role,
        bioPicLink: member.bioPic.node.link,
        bioPicAlt: member.bioPic.node.altText || 'JUST member photo',
        mobileBioPickLink: member.mobileBioPic.node.link || member.bioPic.node.link,
        mobileBioPicAlt: member.mobileBioPic.node.altText || 'JUST member photo',
        bio: member.bio,
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
  team.value = data.value;
}


const selectMember = (member) => {
  //close if selected again
  if (selectedTeamMember.value === member) {
    selectedTeamMember.value = null;
  } else {
    //assign selected member
    selectedTeamMember.value = member;

    if(!isMobile.value) {
      const index = team.value.findIndex((m) => m.name === member.name);
      const carouselTrack = carouselTrackRef.value?.$el?.querySelector('.carousel__track');

      if (index > -1 && carouselTrack) {

        // Get the current transformX value
        const transformMatrix = window.getComputedStyle(carouselTrack).transform;

        const currentTranslateX = transformMatrix !== 'none' ? parseFloat(transformMatrix.split(',')[4]) : 0;
        
        //const scrollOffset = window.getComputedStyle(carouselTrack).transform;
        if(currentTranslateX != 0) {
          carouselTrack.style.transform = `translateX(0)`;
          carouselTrack.style.transition = 'transform 0.3s ease';
        }

        // Optionally re-order the team array if needed
        if (index > 0) {
          team.value.unshift(team.value.splice(index, 1)[0]);
        }
      }
    }
  }
};

const closeMember = () => {
  selectedTeamMember.value = null;
};

const setProfileHover = (member) => {
  activeProfileHover.value = member;
};

const resetProfileHover = () => {
  activeProfileHover.value = null;  // Reset hover when mouse leaves
};

const underlineColor = (member) => {
  if(member.name === 'Denise Chang') return 'blue';
  if(member.name === 'Christian Montgomery') return 'purple';
  if(member.name === 'Gregory Fischer') return 'sage';
  if(member.name === 'Chelanna O’Brien') return 'pink';
  else return 'pink';
}

watchEffect(() => {
  useClickOutside(componentRef, () => {
    selectedTeamMember.value = null;
  })
});

const orderedTeam = computed(() => {
  if (selectedTeamMember.value) {
    const selectedIndex = team.value.findIndex(
      (member) => member.name === selectedTeamMember.value.name
    );
    if (selectedIndex > 0) {
      return [
        team.value[selectedIndex],
        ...team.value.slice(0, selectedIndex),
        ...team.value.slice(selectedIndex + 1),
      ];
    }
  }
  return team.value;
});

const settings = computed(() => {
  const count = team.value.length || 1;
  return {
    itemsToShow: Math.min(count, 4),
    snapAlign: 'start' as const,
    mouseDrag: false,
    arrows: true,
    breakpoints: {
      1281: { itemsToShow: count, arrows: true },
    },
  };
});

watch(team, updateViewportState);

onMounted(() => {
  updateViewportState();
  window.addEventListener('resize', updateViewportState);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportState);
});
</script>

<template>
  <div class="team section-bg">
    <div class="section-container">
      <SectionTitle title="our team" color="sage"></SectionTitle>
    </div>
    <div class="team-container">
      <div ref="componentRef" class="team-container-inner flex">
          <Carousel
            v-if="!isMobile"
            ref="carouselTrackRef"
            v-bind="settings"
            class="carousel"
            :class="{ 'carousel--has-selection': selectedTeamMember || team.length > viewportCols }"
            :style="{ '--items': viewportCols }"
          >
            <Slide 
              v-for="(member, index) in orderedTeam" 
              :key="index" class="team-slide" 
              :class="{ 'expanded': selectedTeamMember && selectedTeamMember.name === member.name }"
            >
            <div class="team-slide-content">
              <!-- toggle open/close when photo is clicked -->
              <a 
                class="team-item" 
                @click="selectMember(member)" 
                @mouseover="setProfileHover(member)" 
                @mouseleave="resetProfileHover"
              >
                <div class="team-photo">
                  <img :src="member.bioPicLink" :alt="member.bioPicAlt" />
                  <ViewBio 
                    v-if="activeProfileHover && activeProfileHover.name === member.name" 
                    :color="underlineColor(member)"
                    :text="selectedTeamMember && selectedTeamMember.name === member.name ? 'hide bio' : 'view bio'"
                    class="view-profile desktop"/>
                </div>
              </a>
              <div v-show="selectedTeamMember && selectedTeamMember.name === member.name" class="team-info">     
                <div class="team-info-content">
                  <div class="close-btn" @click="closeMember">
                    <IconClose />
                  </div>
                  <h5>{{ member.name }}</h5>
                  <span>{{ member.role }}</span>
                  <p>{{ member.bio }}</p>
                </div>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
        <div v-else class="team-stacked-layout">
          <div
            v-for="(member, index) in team"
            :key="index"
            class="team-stacked-item"
            :class="{ 'expanded': selectedTeamMember && selectedTeamMember.name === member.name }"
          >
            <div class="team-stacked-content">
              <a
                class="team-item"
                @click="selectMember(member)"
                @mouseover="setProfileHover(member)"
                @mouseleave="resetProfileHover"
              >
                <div class="team-photo flex items-center">
                  <img :src="member.mobileBioPickLink" :alt="member.mobileBioPickLink" />
                  <div class="team-info-mobile team-info-content">
                    <h5>{{ member.name }}</h5>
                    <span>{{ member.role }}</span>
                    <ViewBio  
                      :color="underlineColor(member)"
                      :text="selectedTeamMember && selectedTeamMember.name === member.name ? 'hide bio' : 'view bio'"
                      class="view-profile"
                    />
                  </div>
                  <!-- position absolute-->
                </div>
              </a>
              <div
                v-show="selectedTeamMember && selectedTeamMember.name === member.name"
                class="team-info"
              >
                <div class="team-info-content">
                  <div class="close-btn" @click="closeMember">
                    <IconClose />
                  </div>
                  <h5>{{ member.name }}</h5>
                  <span>{{ member.role }}</span>
                  <p>{{ member.bio }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.team {
  background-color: #000000;
  &-item {
    cursor: pointer;
    display: block;
    height: 100%;
  }
  &-slide {
    position: relative;
    --info-width: 760px;
    transition: flex 0.3s ease, width 0.3s ease;
    @media (max-width: 1280px) {
      --info-width: 695px;
    }
    @media (max-width: 980px) {
      --info-width: 650px;
    }
    @media (max-width: 760px) {
      --info-width: 350px;
    }
    &.expanded {
      flex: 0 0 calc(100% / var(--items, 5) + var(--info-width, 760px)) !important;
      max-width: none;
    }
    &-content {
      display: flex;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
  }
  &-photo {
    overflow: hidden;
    @media (min-width: 761px) {
      max-width: calc(100vw / var(--items, 5));
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    img {
      @media (max-width: 760px) {
        max-width: 40vw;
      }
    }
    &:hover {
      img {
        @media (min-width: 761px) {
          transform: scale(1.1);
          transition: all .3s ease-in-out;
        }
      }
    }
  }
  &-info {
    background: #ffffff;
    transition: all 0.3s ease;
    overflow: hidden;
    @media (min-width: 761px) {
      width: var(--info-width, 760px);
      flex-shrink: 0;
    }
    @media (max-width: 760px) {
      position: absolute;
      z-index: 9;
    }
    &-content {
      position: relative;
      transition: transform 0.3s ease;
      color: #000000;
      text-align: left;
      box-sizing: border-box;
      @media (min-width: 1481px) {
        padding: 68px 80px 60px;
        width: 760px;
      }
      @media (min-width: 1281px) and (max-width: 1480px) {
        padding: 60px 60px 50px;
        width: 760px;
      }
      @media (min-width: 981px) and (max-width: 1280px) {
        width: 695px;
        padding: 36px 36px 40px;
      }
      @media (min-width: 761px) and (max-width: 980px) {
        width: 650px;
        padding: 40px 32px 40px;
      }
      @media (max-width: 760px) {
        font-size: 12px;
        padding: 28px 20px 25px;
      }
      h5 {
        font-family: 'Inter Bold';
        text-transform: uppercase;
        font-size: 35px;
        margin-bottom: 8px;
        @media (max-width: 1280px) {
          font-size: 28px;
        }
        @media (max-width: 980px) {
          font-size: 26px;
        }
        @media (max-width: 760px) {
          font-size: 22px;
        }
      }
      span {
        display: block;
        font-family: 'Inter Bold';
      }
      p {
        line-height: 1.4;
        margin-top: 38px;
        @media (max-width: 1280px) {
          margin-top: 24px;
          font-size: 16px;
        }
        @media (max-width: 980px) {
          font-size: 16px;
          margin-top: 18px;
        }
        @media (max-width: 760px) {
          margin-top: 20px;
        }
      }
    }
    &-mobile {
      &.team-info-content {
        padding-top: 0;
      }
      h5 {
        color: #FFFFFF;
        font-size: 18px;
      }
      span {
        color: #FFFFFF;
      }
    }
  }
  &-stacked-layout {
    padding: 0 20px;
  }
}

.section-container {
  padding: 100px 0;
  max-width: calc(100% - 240px);
  margin: 0 auto;
  max-width: 1825px;
  padding-left: 80px;
  padding-right: 80px;
  @media (max-width: 1600px) {
    padding: 75px 80px;
  }
  // @media (max-width: 1180px) {
  //   max-width: calc(100% - 80px);
  // }
  @media (max-width: 760px) {
    max-width: calc(100% - 80px);
    padding: 45px 0 40px;
  }
}

.close-btn {
  position: absolute;
  top: 25px;
  right: 30px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  transition: background 0.3s ease-in-out, color 0.3s;
  @media (max-width: 760px) {
    top: 15px;
    right: 15px;
  }
  &:hover {
    background: #000000;
    svg {
      color: #ffffff;
    }
  }
}

.aia-banner {
  font-family: 'Neumatic Compressed';
  color: #ffffff;
  font-size: 150px;
  text-align: center;
  padding: 40px 0;
}

.view-profile {
  color: white;
  display: flex;
  align-items: center;
  font-size: 20px;
  text-transform: uppercase;
  font-family: 'Calling Code';
  transition: all .3s ease-in-out;
  @media (max-width: 1080px) {
    font-family: 16px;
  }
  &.desktop {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  .team-slide {
    scroll-snap-align: start;
  }
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none;
  color: #fff;
  border: none;
  width: 42px;
  height: 42px;
  padding: 0;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  svg {
    width: 42px;
    height: 42px;
  }
}

:deep(.carousel__prev) {
  left: 16px;
}

:deep(.carousel__next) {
  right: 16px;
}

:deep(.carousel__prev--disabled),
:deep(.carousel__next--disabled) {
  opacity: 0.3;
  cursor: default;
}

.carousel--has-selection :deep(.carousel__prev),
.carousel--has-selection :deep(.carousel__next) {
  display: flex;
}
</style>