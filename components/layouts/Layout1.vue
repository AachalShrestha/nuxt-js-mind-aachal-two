<template>
    <div class="layout1">
    <ClientOnly>
      <div class="pr-5 z-100">
        <Drawer />
      </div>
      <div class="container">
        <h1 class="text-3xl md:text-3xl lg:text-6xl lg:mb-10 font-bold">{{ data.title }}</h1>
        <p class="text-lg md:text-2xl lg:text-xl pb-10 font-bold">{{ data.description }}</p>

        <ContentRenderer :value="data" />

        <div v-if="data.imagegallery && data.imagegallery.showgallery == true" class="pt-10 pb-20">
            <ImageGallery />
        </div>

        <div class="text-xs leading-3 container">
          <hr>
          <p class="text-xs opacity-50 hover:opacity-100 pb-5">Last update: {{ formatDate(data.date) }}</p>
          <article v-if="data.tags" class="tags">
            <li v-for="(item, index) in data.tags" :key="index" class="pt-2 text-xs opacity-50 hover:opacity-100">
              <NuxtLink :to="`/tags/${item}`">{{ item }}</NuxtLink>
            </li>
          </article>
        </div>
      </div>
      <ShareButtons />
    
      <!-- SEO metadata -->
      <!-- Regular Meta Tags -->
      <Title>{{ data.title }}</Title>
      <Meta name="description" :content="data.description" />
      <Meta name="tags" :content="data.tags" />
      <Meta name="keywords" :content="data.tags.join(', ')" /> <!-- Add keywords here -->
      <!-- Open Graph Meta Tags -->
      <Meta property="og:title" :content="data.title" />
      <Meta property="og:description" :content="data.description" />
      <Meta property="og:image" :content="data.thumbnail" /> <!-- Add an image URL here -->
      <Meta property="og:url" :content="data.url" /> <!-- Add the current URL -->
      <Meta property="og:type" content="article" /> 
    
    </ClientOnly>
    </div>
  </template>
  
  <script setup>
  defineProps(['data', 'formatDate']);
  </script>
  