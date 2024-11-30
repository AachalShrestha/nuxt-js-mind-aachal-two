<template>
<div class="">
  <ul 
    v-for="post in folders"
    :key="post.slug"
    >
    <NuxtLink :to="post._path" >
        <li class="">{{ post.title }}</li>
    </NuxtLink>
  </ul>
  <hr>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAsyncData } from '#app';

// Define a ref for storing folders
const folders = ref([]);

// Fetch all posts from both /folders and /page
const { data: Allposts } = await useAsyncData('folders', () => queryContent('/')
.sort({ numbernavigation: 1 })
.find());

// Filter the data to include only directories (folders)
onMounted(() => {
  if (Allposts.value) {
    folders.value = Allposts.value.filter(post => post.folder && post.folder === 'folder')
  }
});
</script>
