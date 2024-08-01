<script setup lang="ts">
import { ref } from 'vue';

const services = ref([]);
const selectedService = ref(null);

const config = useRuntimeConfig();

// Encode the GraphQL query for inclusion in the URL
const encodedQuery = encodeURIComponent(`
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
`);

const { data, error } = await useFetch(`${config.public.wordpressUrl}?query=${encodedQuery}`, {
  method: 'get',
  transform: (data) => {
    if (data?.data?.page?.landingPage?.serviceAreas) {
      return data.data.page.landingPage.serviceAreas.map((service) => ({
        serviceName: service.serviceName,
        serviceAreas: service.serviceArea.map(area => area.serviceArea.trim())
      }));
    } else {
      console.error("Unexpected response structure for services", data);
      return [];
    }
  }
});

if (error.value) {
  console.error('Error fetching service data:', error.value);
} else {
  services.value = data.value;
  if (services.value.length > 0) {
    selectedService.value = services.value[0].serviceName;
  }
}

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
          <ul >
            <li v-for="(service, index) in services" :key="index" class="service-name" :class="(selectedService === service.serviceName) ? 'active': ''">
              <h4>
                <a @click="selectService(service.serviceName)">{{ service.serviceName }}</a>
              </h4>
            </li>
          </ul>
        </div>
        <div class="services-right">
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
  }
  &-container {
    max-width: calc(100% - 240px);
    margin: 0 auto;
    @media (max-width: 760px) {
      max-width: calc(100% - 40px);
    }
  }
}

.service {
  &s {
    margin-top: 70px;
    padding: 0 65px;
    @media (max-width: 1600px) {
      margin-top: 55px;
      padding: 0 45px;
    }
    @media (max-width: 1280px) {
      padding: 0 20px;
    }
    ul {
      list-style: none;
    }
    &-left {
      max-width: 50%;
      margin-right: 25%;
      @media (max-width: 1600px) {
        margin-right: 15%;
      }
    }
    &-right {
      flex-basis: 40%;
      flex-shrink: 0;
      @media (max-width: 1600px) {
        flex-basis: 35%;
      }
    }
  }
  &-name {
    color: #ffffff;
    position: relative;
    width: max-content;
    &.active {
      &:after {
        content: '';
        width: calc(100% + 10px);
        height: 5px;
        position: absolute;
        bottom: 37px;
        left: -5px;
        z-index: 8;
        background: #E838BB;
        //fix this transition
        transition: ease 0.3s all;
      }
    }
    h4 {
      font-family: 'Inter Bold';
      text-transform: uppercase;
      font-size: 75px;
      line-height: 1.1;
      padding-bottom: 40px;
      @media (max-width: 1800px) {
        font-size: 65px;
        padding-bottom: 30px;
      }
      @media (max-width: 1600px) {
        font-size: 55px;
        padding-bottom: 30px;
      }
    }
  }
  &-breakdown {
    color: #ffffff;
    list-style: none;
    li {
      font-size: 36px;
      line-height: 1.5;
      @media (max-width: 1600px) {
        font-size: 34px;
      }
    }
  }
}
</style>