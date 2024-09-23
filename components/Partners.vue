<script setup lang="ts">
import { ref } from 'vue';

const partners = ref([]);
const visibleCount = ref(12);

const config = useRuntimeConfig();

const updateVisibleCount = () => {
  if (window.innerWidth <= 768) {
    visibleCount.value = 6; // Mobile: Show 6 partners
  } else if (window.innerWidth < 1401) {
    visibleCount.value = 12; // Desktop: Show 12 partners
  } else {
    visibleCount.value = 15;
  }
}

onMounted(() => {
  updateVisibleCount();
  window.addEventListener('resize', updateVisibleCount);
});

// Clean up the event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVisibleCount);
});

// Encode the GraphQL query for inclusion in the URL
const encodedQuery = encodeURIComponent(`
  query NewQuery {
    page(id: "6", idType: DATABASE_ID) {
      landingPage {
        partners {
          partnerLink
          loho {
            node {
              altText
              link
            }
          }
        }
      }
    }
  }
`);

const { data, error } = await useFetch(`${config.public.wordpressUrl}?query=${encodedQuery}`, {
  method: 'get',
  transform: (data) => {
    if (data?.data?.page?.landingPage?.partners) {
      return data.data.page.landingPage.partners.map((partner) => ({
        link: partner.partnerLink,
        imageUrl: partner.loho.node.link,
        imageAlt: partner.loho.node.altText || 'Partner logo'
      }));
    } else {
      console.error("Unexpected response structure for partners", data);
      return [];
    }
  }
});

if (error.value) {
  console.error('Error fetching partner data:', error.value);
} else {
  partners.value = data.value;
}

const visiblePartners = computed(() => {
  return partners.value.slice(0, visibleCount.value);
});

const loadMorePartners = () => {
  visibleCount.value += 4;
};
</script>

<template>
  <div class="partners-outer section-bg section-with-title">
    <Testimonials />
    <div class="section-container">
      <SectionTitle title="collaborators" color="brown"></SectionTitle>
      <ul class="partners">
        <li v-for="(partner, index) in visiblePartners" :key="index">
          <PartnerLogo 
            :link="partner.link" 
            :image-url="partner.imageUrl" 
            :image-alt="partner.imageAlt">
          </PartnerLogo>
        </li>
      </ul>
      <a 
        v-if="visibleCount < partners.length"
        href="#" 
        data-partners-see-more="" 
        class="btn-more"
        @click.prevent="loadMorePartners"
      >
        See more +
      </a>
    </div>
    <h5 class="aia-banner"><NuxtLink to="https://centersf.org/community-alliance-awards/?utm_campaign=later-linkinbio-centerarchdesignsf&utm_content=later-38927758&utm_medium=social&utm_source=linkin.bio" target="_blank">2023 AIA COMMUNITY ALLIANCE AWARD WINNER</NuxtLink></h5>
    <h5 class="aia-banner">SBE CERTIFIED</h5>
  </div>
</template>

<style lang="scss" scoped>
.section {
  &-with-title {
    @media (min-width: 1601px) {
      padding-top: 120px;
    }
  }
  &-bg {
    background-color: #000;
    z-index: 1;
  }
  &-container {
    max-width: calc(100% - 240px);
    margin: 0 auto;
    margin-bottom: 40px;
    max-width: 1825px;
    padding: 0 80px;
    @media (max-width: 760px) {
      padding: 0 40px;
    }
  }
}

.partners {
  margin-top: 120px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media (max-width: 1480px) {
    margin-top: 65pxl
  }
  @media (max-width: 1280px) {
    margin-top: 75px;
  }
  @media (max-width: 760px) {
    margin-top: 60px;
  }
  li {
    flex-basis: 20%;
    margin-bottom: 65px;
    display: flex;
    justify-content: center;
    @media (max-width: 1400px) {
      flex-basis: 25%;
    }
    @media (max-width: 760px) {
      flex-basis: 50%;
    }
  }
}

.aia-banner {
  font-family: 'Inter Bold';
  color: #ffffff;
  font-size: calc(0.034 * 100vw);
  text-align: center;
  padding: 50px 0;
  @media (max-width: 760px) {
    padding: 20px 0;
  }
}

.btn-more {
  color: #FFFFFF;
  position: relative;
  &:after {
    transform: scaleX(0);
    transform-origin: bottom left;
    transition: transform 0.6s ease;
    content: "";
    width: calc(100% + 10px);
    height: 3px;
    position: absolute;
    bottom: -4px;
    left: -5px;
    z-index: 8;
    background: #E838BB;
  }
  &:hover {
    &:after {
      transform: scaleX(1);
      transition: ease 0.3s all;
      transition-delay: 0.2s;
    }
  }
}
</style>