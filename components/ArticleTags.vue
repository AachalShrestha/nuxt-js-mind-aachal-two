<template>
<div>
  <ClientOnly >
  <article v-if="page.tags">
    <li v-for="(item, index) in page.tags" :key="index">
      <NuxtLink :to="`/tags/${item}`">{{ item }}</NuxtLink>
    </li>
  </article>
  </ClientOnly>
</div>
</template>

<script setup>
const { page } = useContent();
</script>

<style scoped>
li { 
list-style: none;
display: inline-block;
padding-right: 4px;
}
</style>