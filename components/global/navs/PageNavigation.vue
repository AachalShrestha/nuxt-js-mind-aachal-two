<script setup>
import { ref } from 'vue';
import { useAsyncData } from '#app'; // Ensure correct import for useAsyncData

// Define a reactive reference to store the grouped content files
const groupedPagesFiles = ref({});

// Fetch all content files
const { data } = await useAsyncData('contentPageFiles', async () => {
  const content = await queryContent('/page').find(); // Fetch all files and folders
  return content;
});

// Group the content files by their folder
if (data.value) {
  data.value.forEach(file => {
    const folder = file._dir || 'Uncategorized';
    if (!groupedPagesFiles.value[folder]) {
      groupedPagesFiles.value[folder] = [];
    }
    groupedPagesFiles.value[folder].push(file);
  });
}
</script>

<template>
  <div>
    <div v-for="(files, folder) in groupedPagesFiles" :key="folder" class="pt-2">
      <ul class="">
        <li v-for="(file, index) in files" :key="index">
          <a :href="file._path">{{ file.title || file._path }}</a>
        </li>
      </ul>
    </div>
    <hr>
  </div>
</template>
