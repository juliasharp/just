<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';
import { ref, computed } from 'vue';

const componentRef = ref(null);
const team = ref([]);
const selectedTeamMember = ref(null);

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
        bioPicAlt: member.bioPic.node.altText || 'Team member photo',
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
  if (selectedTeamMember.value === member) {
    selectedTeamMember.value = null;
  } else {
    selectedTeamMember.value = member;
    const index = team.value.findIndex((m) => m.name === member.name);
    if (index > 0) {
      team.value.unshift(team.value.splice(index, 1)[0]);
    }
  }
};

const closeMember = () => {
  selectedTeamMember.value = null;
};

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

const settings = {
  itemsToShow: 3,
  snapAlign: 'start',
  breakpoints: {
    900: {
      itemsToShow: 4,
    },
    1280: {
      itemsToShow: 5,
      mouseDrag: false,
    },
  }
};
</script>

<template>
  <div class="team section-bg">
    <div class="section-container">
      <SectionTitle title="our team" color="sage"></SectionTitle>
    </div>
    <div class="team-container">
      <div ref="componentRef" class="team-container-inner flex">
          <Carousel v-bind="settings">
            <Slide v-for="(member, index) in orderedTeam" :key="index" class="team-slide" :class="{ 'expanded': selectedTeamMember && selectedTeamMember.name === member.name }">
            <div class="team-slide-content">
              <!-- toggle open/close when photo is clicked -->
              <a class="team-item" @click="selectMember(member)">
                <div class="team-photo">
                  <img :src="member.bioPicLink" :alt="member.bioPicAlt" />
                </div>
              </a>
              <div v-show="selectedTeamMember && selectedTeamMember.name === member.name" class="team-info">     
                <div class="team-info-content">
                  <div class="close-btn" @click="closeMember">
                    <IconClose />
                  </div>
                  <h3>{{ member.name }}</h3>
                  <span>{{ member.role }}</span>
                  <p>{{ member.bio }}</p>
                </div>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team {
  background-color: #000000;
  &-item {
    cursor: pointer;
  }
  &-slide {
    position: relative;
    transition: flex 0.3s ease, width 0.3s ease;
    &.expanded {
      width: calc(20% + 760px) !important;
      flex: 0 0 auto;
      max-width: none;
      @media (max-width: 760px) {
        width: calc(33.33% + 350px) !important;
      }
    }
    &-content {
      display: flex;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
  }
  &-photo {
    max-width: calc(100vw / 5);
    @media (max-width: 1280px) {
      max-width: calc(100vw / 4);
    }
    @media (max-width: 900px) {
      max-width: calc(100vw / 3);
    }
    img {
      //transition: transform 0.3s ease-in-out;
      // height: 100%;
    }
  }
  &-info {
    background: #ffffff;
    transition: all 0.3s ease;
    &-content {
      width: 760px;
      color: #000000;
      padding: 90px 80px 60px;
      text-align: left;
      @media (max-width: 1280px) {
        padding: 65px 50px 50px;
      }
      @media (max-width: 760px) {
        width: 350px;
        font-size: 12px;
        padding: 28px 20px 20px;
      }
      h3 {
        font-family: 'Inter Bold';
        text-transform: uppercase;
        font-size: 35px;
        margin-bottom: 8px;
        @media (max-width: 1280px) {
          font-size: 28px;
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
        @media (max-width: 760px) {
          margin-top: 20px;
        }
      }
    }
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
</style>