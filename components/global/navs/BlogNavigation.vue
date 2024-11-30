<script setup>
import { ref } from 'vue';
import { useAsyncData } from '#app'; // Ensure correct import for useAsyncData

// Define a reactive reference to store the grouped content files
const groupedBlogFiles = ref({});

// Fetch all content files
const { data } = await useAsyncData('contentBlogFiles', async () => {
  const content = await queryContent('/blog')
    .sort({ date: 1 })
    .limit(5)
    .find(); // Fetch all files and folders
  return content;
});

// Group the content files by their folder
if (data.value) {
  data.value.forEach(file => {
    const folder = file._dir || 'Uncategorized';
    if (!groupedBlogFiles.value[folder]) {
      groupedBlogFiles.value[folder] = [];
    }
    groupedBlogFiles.value[folder].push(file);
  });
}

// Function to format the date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}
</script>

<template>
  <div>
    <div v-for="(files, folder) in groupedBlogFiles" :key="folder" >
      <ul>
        <li v-for="(file, index) in files" :key="index" class="pb-3">
          <a :href="file._path">{{ file.title || file._path }}
          <p v-if="file.date" class="text-xs opacity-50 hover:opacity-100">last updated on: {{ formatDate(file.date) }}
            <span v-if="file.author" class="text-xs">authored by: {{ file.author }} </span>
          </p>
        </a>
        </li>
      </ul>
    </div>
  </div>
</template>
