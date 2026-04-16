<script setup lang="ts">
const config = useRuntimeConfig()

const query = `
  query NewQuery {
    page(id: "435", idType: DATABASE_ID) {
      emptyChair {
        gallerySectionTitle
        imageGallery {
          imageOrVideo {
            node {
              mimeType
              sourceUrl
              mediaItemUrl
              altText
            }
          }
        }
      }
    }
  }
`

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: { query },
  transform: (d: any) => {
    return {
      gallerySectionTitle: d?.data?.page?.emptyChair?.gallerySectionTitle,
      imageGallery: d?.data?.page?.emptyChair?.imageGallery ?? [],
    }
  }
})

</script>

<template>
  <div class="emptychair-gallery">
    <div class="ec-container">
      <h2 class="gallery-section-title ec-section-title">{{ data?.gallerySectionTitle }}</h2>
    </div>
    <div class="gallery-container">
      <div class="gallery-row gallery-row--bottom">
        <div v-for="(item, index) in data?.imageGallery?.slice(0, 4)" :key="index" :class="`gallery-item gallery-item--${Number(index) + 1}`">
          <img
            v-if="item.imageOrVideo?.node?.mimeType?.startsWith('image/')"
            :src="item.imageOrVideo.node.sourceUrl"
            :alt="item.imageOrVideo.node.altText || 'Empty Chair Gallery Image'"
            class="gallery-img"
            decoding="async"
          />
          <video
            v-else-if="item.imageOrVideo?.node?.mimeType?.startsWith('video/')"
            :src="item.imageOrVideo.node.mediaItemUrl || item.imageOrVideo.node.sourceUrl"
            :aria-label="item.imageOrVideo.node.altText || 'Empty Chair Gallery Video'"
            class="gallery-video"
            autoplay
            loop
            muted
            playsinline
          />
        </div>
      </div>
      <div class="gallery-row gallery-row--top">
        <div v-for="(item, index) in data?.imageGallery?.slice(4)" :key="index" :class="`gallery-item gallery-item--${Number(index) + 5}`">
          <img
            v-if="item.imageOrVideo?.node?.mimeType?.startsWith('image/')"
            :src="item.imageOrVideo.node.sourceUrl"
            :alt="item.imageOrVideo.node.altText || 'Empty Chair Gallery Image'"
            class="gallery-img"
            decoding="async"
          />
          <video
            v-else-if="item.imageOrVideo?.node?.mimeType?.startsWith('video/')"
            :src="item.imageOrVideo.node.mediaItemUrl || item.imageOrVideo.node.sourceUrl"
            :aria-label="item.imageOrVideo.node.altText || 'Empty Chair Gallery Video'"
            class="gallery-video"
            autoplay
            loop
            muted
            playsinline
          />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.emptychair-gallery {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gallery-container {
  padding: 40px 0 80px;
  display: flex;
  flex-direction: column;
  gap: 35px;
  @media (max-width: 767px) {
    gap: 16px;
    padding: 0 1rem 50px;
  }
}

.gallery-row {
  display: flex;
  gap: 36px;
  margin-left: -6%;
  margin-right: -6%;

  @media (max-width: 767px) {
    margin-left: 0;
    margin-right: 0;
    flex-wrap: wrap;
    gap: 16px;
  }

  &--bottom {
    align-items: center;
    @media (min-width: 768px) {
      align-items: flex-end;
    }
  }

  &--top {
    align-items: center;
    @media (min-width: 768px) {
      align-items: flex-start;
    }
  }
}

.gallery-item {
  width: calc(25% - 36px * 3 / 4);
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: calc(50% - 16px / 2);
  }
  &--1 {
    @media (max-width: 767px) {
      width: calc(57% - 8px);
    }
  }
  &--2 {
    @media (max-width: 767px) {
      width: calc(43% - 8px);
    }
  }
  &--3 {
    @media (max-width: 767px) {
      width: calc(54% - 8px);
    }
  }
  &--4 {
    @media (max-width: 767px) {
      width: calc(46% - 8px);
    }
  }
  &--5 {
    width: calc(25% - 8px);
    @media (min-width: 768px) {
      width: calc(18% - 36px * 3 / 4)
    }
  }
  &--6 {
    width: calc(75% - 8px);
    @media (min-width: 768px) {
      width: calc(27% - 36px * 3 / 4)
    }
  }
  &--7 {
    width: calc(65% - 8px);
    @media (min-width: 768px) {
      width: calc(33% - 36px * 3 / 4)
    }
  }
  &--8 {
    width: calc(35% - 8px);
    @media (min-width: 768px) {
      width: calc(22% - 36px * 3 / 4)
    }
  }
}

.gallery-img,
.gallery-video {
  width: 100%;
  height: auto;
  display: block;
}
</style>