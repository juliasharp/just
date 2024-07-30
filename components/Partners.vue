<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '#imports';

const partners = ref([]);

const config = useRuntimeConfig();

const query = `
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
`;

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'post',
  body: JSON.stringify({ query }),
  headers: {
    'Content-Type': 'application/json'
  },
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
  console.error('Error fetching data:', error.value);
} else {
  partners.value = data.value;
}
</script>

<template>
  <div class="section-bg section-with-title">
    <div class="section-container">
      <SectionTitle title="partners" color="brown"></SectionTitle>
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
  </div>
</template>

<style lang="scss" scoped>
.section {
  &-bg {
    background-color: #000;
    height: 1080px;
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
</style>