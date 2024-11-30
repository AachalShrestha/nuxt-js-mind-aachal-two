<template>
    <div>
      <!-- Loop through the relatedPages prop to create a button for each page -->
      <div v-for="(page, index) in relatedPages" :key="index">
        <NuxtLink :to="`/page/${page.toLowerCase().replace(/\s+/g, '-')}`">
            {{ page }}
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    relatedPages: {
      type: Array,
      required: true,
    },
  })
  </script>
  