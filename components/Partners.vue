<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWordpressApi } from '~/composables/useWordpressApi';

const partners = ref([]);

const query = `
  query NewQuery {
    page(id: 6, idType: DATABASE_ID) {
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

onMounted(async () => {
  try {
    const response = await useWordpressApi(query);
    
    if (response.data.page.landingPage.partners) {
      partners.value = response.data.page.landingPage.partners.map((partner: any) => ({
        link: partner.partnerLink,
        imageUrl: partner.loho.node.link,
        imageAlt: partner.loho.node.altText || 'Partner logo'
      }));
      
    } else {
      console.error("Unexpected response structure", response);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="section-bg section-with-title">
    <div class="section-container">
      <SectionTitle title="partners" color="brown"></SectionTitle>
      <div class="partners">
        <PartnerLogo
          v-for="(partner, index) in partners" 
          :key="index" 
          :link="partner.link" 
          :image-url="partner.imageUrl" 
          :image-alt="partner.imageAlt">
        </PartnerLogo>
      </div>
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
}
</style>