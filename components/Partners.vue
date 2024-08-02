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
    <h5 class="aia-banner">2023 AIA COMMUNITY ALLIANCE AWARD WINNER</h5>
  </div>
</template>

<style lang="scss" scoped>
.section {
  &-bg {
    background-color: #000;
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
  }
}

.aia-banner {
  font-family: 'Neumatic Compressed';
  color: #ffffff;
  font-size: 150px;
  text-align: center;
  padding: 50px 0;
}
</style>