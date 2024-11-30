<template>
  <div>
    <div v-for="(posts, folderName) in folders" :key="folderName" class="">
      <ul>
        <li v-for="post in posts" :key="post.slug" class="pb-1 md:pb-2 lg:pb-3">
          <NuxtLink :to="post._path" class="font-bold text-4xl lg:text-6xl xl:text-6xl">
            {{ post.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAsyncData } from '#app';
import menus from '../../../public/_data/menus.json'; // Import menus.json

// Define a ref for storing grouped and sorted folders
const folders = ref({});

// Use the constant path in queryContent
const { data: foldersPosts } = await useAsyncData('folders', () =>
  queryContent('/')
    .sort({ numbernavigation: -1 }) // Sorting in descending order (highest first)
    .find()
);

onMounted(() => {
  // Filter out the 'tags' folder and posts where 'numbernavigation' is 0
  let filteredPosts = (foldersPosts.value || []).filter(post => post._dir !== 'tags' && post.numbernavigation !== 0);

  // Apply filtering based on menus.json and the 'collections' folder condition
  filteredPosts = filteredPosts.filter(post => {
    const folderName = post._dir;
    
    // Remove all files from 'collections' if 'excludefromnavigation' equals 2
    if (folderName === 'collections' && menus.submenu['excludefromnavigation'] === 2) {
      console.log(`Excluding folder: ${folderName} because 'excludefromnavigation' is set to 2`);
      return false; // Exclude 'collections' folder
    }

    // Other condition for excluding submenu
    if (menus.submenu['excludefromnavigation'] === 2) {
      return false; // Exclude based on the position value
    }

    return true; // Include other folders
  });

  // Group posts by folder name (_dir)
  const grouped = filteredPosts.reduce((acc, post) => {
    const folderName = post._dir; // Folder name is stored in _dir
    if (!acc[folderName]) {
      acc[folderName] = [];
    }
    acc[folderName].push(post);
    return acc;
  }, {});

  // Sort posts within each folder by 'numbernavigation' in descending order
  for (const folder in grouped) {
    grouped[folder].sort((a, b) => b.numbernavigation - a.numbernavigation);
  }

  // Assign the grouped and sorted posts to the folders ref
  folders.value = grouped;
});
</script>
