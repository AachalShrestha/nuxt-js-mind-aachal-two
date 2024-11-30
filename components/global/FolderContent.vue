<template>
  <div class="mt-5" v-if="items.folder !== 'page'">
    <MasonryWall :items="items" :ssr-columns="1" :gap="16">
      <template #default="{ item, index }">
        <div
          :style="{ height: `${item}px` }"
          class="masonry-item"
        >
          <div class="masonry-image relative">
            <div v-if="!imageLoaded[index]" class="absolute inset-0 flex items-center justify-center bg-gray-200">
              <p>Loading image...</p> <!-- Loader text -->
            </div>
            <NuxtImg
              :src="item.thumbnail"
              alt="Post thumbnail"
              class="rounded-md mb-4"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
              :class="{ 'hidden': !imageLoaded[index] }"
            />
          </div>
          <div class="masonry-item-text p-4">
            <NuxtLink :to="item._path" class="text-xl font-semibold mb-2">
              {{ item.title }}
            </NuxtLink>
            <p v-if="item.description" class="text-gray-600 line-clamp-3">{{ item.description }}</p>
            <ul v-if="item.tags" class="text-xs mt-2">
              <li v-for="(tag, index) in item.tags" :key="index" class="inline mr-2">
                <NuxtLink :to="`/tags/${tag}`">{{ tag }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </template>    
    </MasonryWall>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAsyncData, useRoute } from '#app';
import MasonryWall from '@yeger/vue-masonry-wall';

const items = ref([]);
const imageLoaded = ref([]); // Store loading state for each image

// Get the current route
const route = useRoute();
const currentPath = route.path.replace(/\/$/, ''); // Normalize the path by removing trailing slashes

// Fetch all posts from both /folders and /page
const { data: allPosts } = await useAsyncData('folders', () =>
  queryContent(currentPath).sort({ promoted: 1 }).find()
);

// Filter the data to include only directories (folders)
onMounted(() => {
  if (allPosts.value) {
    items.value = allPosts.value.filter(
      (post) => post.folder && post.folder === 'page' && post.folder !== 'folder'
    );
    imageLoaded.value = Array(items.value.length).fill(false); // Initialize imageLoaded state
  }
});

// Functions to handle image load and error
const onImageLoad = (index) => {
  imageLoaded.value[index] = true; // Mark image as loaded
};

const onImageError = (index) => {
  console.error(`Error loading image at index ${index}`); // Handle image error
};
</script>
