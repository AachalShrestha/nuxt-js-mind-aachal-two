<script setup>
import { ref, onMounted } from 'vue';
import { useAsyncData } from '#app';
import MasonryWall from '@yeger/vue-masonry-wall';

// Define a ref for storing folders and loading state
const folders = ref([]);

// Fetch all posts from both /folders and /page
const { data: allPosts } = await useAsyncData('folders', () =>
  queryContent('/')
    .sort({ promoted: 1 })
    .find()
);

// Filter the data to include only directories (folders)
onMounted(() => {
  if (allPosts.value) {
    folders.value = allPosts.value.filter(item => item.folder);
  }
});

// Define the reactive state for items
const items = folders;

// Define loading states for each image
const loadingImages = ref({});

function handleImageLoad(index) {
  loadingImages.value[index] = false;  // Mark image as loaded
}

function handleImageError(index) {
  loadingImages.value[index] = 'error';  // Mark image as errored
}
</script>

<template>
  <div>
    <div class="container animate-fade animate-once animate-delay-[500ms] mt-10 mb-20">     
      <MasonryWall :items="items" :ssr-columns="1" :gap="16" class="mt-5">
        <template #default="{ item, index }">
          <div
            :style="{ height: `${item}px` }"
            class="masonry-item"
          >
            <div class="masonry-image relative">
              <!-- Show loader if the image is still loading -->
              <div
                v-if="loadingImages[index] !== false"
                class="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md"
              >
                <p v-if="loadingImages[index] !== 'error'">Loading image...</p>
                <p v-else class="text-red-500">Error loading image</p>
              </div>

              <!-- Image with lazy loading and events to handle loading state -->
              <NuxtImg
                :src="item.thumbnail"
                alt="Post thumbnail"
                class="rounded-md mb-4"
                loading="lazy"
                @load="handleImageLoad(index)"
                @error="handleImageError(index)"
              />
            </div>

            <NuxtLink :to="item._path" class="block">
              <div class="masonry-item-text p-4">
                <h2 class="text-xl font-semibold mb-2">{{ item.title }}</h2>
                <p v-if="item.description" class="text-gray-600 line-clamp-3">{{ item.description }}</p>
                <ClientOnly>
                  <ul v-if="item.tags" class="text-xs mt-2">
                    <li v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="inline mr-2">
                      <NuxtLink :to="`/tags/${tag}`">{{ tag }}</NuxtLink>
                    </li>
                  </ul>
                </ClientOnly>
              </div>
            </NuxtLink>
          </div>
        </template>
      </MasonryWall>
    </div>
  </div>  
</template>
