<script setup lang="ts">
import { ref } from 'vue';

const partners = ref([]);

const config = useRuntimeConfig();

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
</script>

<template>
  <div class="section-bg section-with-title">
    <div class="section-container">
      <SectionTitle title="collaborators" color="brown"></SectionTitle>
      <ul class="partners">
        <li v-for="(partner, index) in partners" :key="index">
          <PartnerLogo 
            :link="partner.link" 
            :image-url="partner.imageUrl" 
            :image-alt="partner.imageAlt">
          </PartnerLogo>
        </li>
      </ul>
    </div>
    <h5 class="aia-banner"><NuxtLink to="https://centersf.org/community-alliance-awards/?utm_campaign=later-linkinbio-centerarchdesignsf&utm_content=later-38927758&utm_medium=social&utm_source=linkin.bio">2023 AIA COMMUNITY ALLIANCE AWARD WINNER</NuxtLink></h5>
    <h5 class="aia-banner">SBE CERTIFIED</h5>
  </div>
</template>

<style lang="scss" scoped>
.section {
  &-bg {
    background-color: #000;
    z-index: 1;
  }
  &-container {
    max-width: calc(100% - 240px);
    margin: 0 auto;
  }
}

.partners {
  margin-top: 120px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  li {
    flex-basis: 20%;
    margin-bottom: 40px;
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
</style>