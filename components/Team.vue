<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';
import { ref, computed } from 'vue';

const team = ref([]);
const selectedTeamMember = ref(null);

const config = useRuntimeConfig();

//TODO: implement click outside to close team bio.
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
  selectedTeamMember.value = member;
  const index = team.value.findIndex((m) => m.name === member.name);
  if (index > 0) {
    team.value.unshift(team.value.splice(index, 1)[0]);
  }
};

const closeMember = () => {
  selectedTeamMember.value = null;
};

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
  itemsToShow: 2,
  snapAlign: 'start',
  breakpoints: {
    900: {
      itemsToShow: 5,
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
      <div class="team-container-inner flex">
          <Carousel v-bind="settings">
            <Slide v-for="(member, index) in orderedTeam" :key="index" class="team-slide" :class="{ 'expanded': selectedTeamMember && selectedTeamMember.name === member.name }">
            <div class="team-slide-content">
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
    }
    &-content {
      display: flex;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
  }
  &-photo {
    max-width: calc(100vw / 5);
    img {
      height: 100%;
    }
  }
  &-info {
    background: #ffffff;
    transition: all 0.3s ease;
    &-content {
      width: 760px;
      color: #000000;
      padding: 100px 80px 60px;
      text-align: left;
      h3 {
        font-family: 'Inter Bold';
        text-transform: uppercase;
        font-size: 35px;
        margin-bottom: 8px;
      }
      span {
        display: block;
      }
      p {
        line-height: 1.4;
        margin-top: 38px;
      }
    }
  }
}

.section-container {
  padding: 120px 0 100px;
  max-width: calc(100% - 240px);
  margin: 0 auto;
  @media (max-width: 1180px) {
    max-width: calc(100% - 80px);
  }
}

.close-btn {
  position: absolute;
  top: 25px;
  right: 30px;
  cursor: pointer;
}

.aia-banner {
  font-family: 'Neumatic Compressed';
  color: #ffffff;
  font-size: 150px;
  text-align: center;
  padding: 40px 0;
}
</style>