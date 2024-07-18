<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWordpressApi } from '~/composables/useWordpressApi';

const services = ref([]);
const selectedService = ref(null);

const query = `
  query NewQuery {
    page(id: 6, idType: DATABASE_ID) {
      landingPage {
        serviceAreas {
          serviceName
          serviceArea {
            serviceArea
          }
        }
      }
    }
  }
`;

onMounted(async () => {
  try {
    const response = await useWordpressApi(query);
    if (response.data.page.landingPage.serviceAreas) {
      services.value = response.data.page.landingPage.serviceAreas.map((service) => ({
        serviceName: service.serviceName,
        serviceAreas: service.serviceArea.map(area => area.serviceArea.trim())
      }));
      console.log("transformed services: ", services.value);

      if (services.value.length > 0) {
        selectedService.value = services.value[0].serviceName;
      }
    } else {
      console.error("Unexpected response structure", response);
    }
  } catch (error) {
    console.error(error);
  }
});

const selectService = (serviceName) => {
  selectedService.value = serviceName;
};

</script>

<template>
  <div class="section-bg section-with-title">
    <div class="section-container">
      <SectionTitle title="what we do" color="sage"></SectionTitle>
      <div class="flex services">
        <div class="services-left">
          <ul v-for="(service, index) in services" :key="index" >
            <li class="service-name">
              <h4>
                <a @click="selectService(service.serviceName)">{{ service.serviceName }}</a>
              </h4>
            </li>
          </ul>
        </div>
        <div class="service-right">
          <ul v-for="service in services" :key="service.serviceName" class="service-breakdown" v-show="selectedService === service.serviceName">
            <li v-for="area in service.serviceAreas" :key="area">{{ area }}</li>
          </ul>
        </div>
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

.service {
  &s {
    margin-top: 70px;
    padding: 0 65px;
    ul {
      list-style: none;
    }
    &-left {
      max-width: 50%;
      margin-right: 25%;
    }
  }
  &-name {
    color: #ffffff;
    h4 {
      text-transform: uppercase;
      font-size: 85px;
      line-height: 1.1;
      padding-bottom: 40px;
      @media(max-width: 1600px) {
        font-size: 75px;
      }
    }
  }
  &-breakdown {
    color: #ffffff;
    list-style: none;
    li {
      font-size: 36px;
      line-height: 1.5;
    }
  }
}
</style>