<template>
<div>
  <div class="pr-5">
    <Drawer />
  </div>
  <main class="mx-auto max-w-4xl space-y-6 px-4 mb-20 mt-10">
    <div class="text-xl font-bold">
      Blog
    </div>
    <!-- Responsive Masonry Layout -->
    <div class="masonry">
      <div 
        class="masonry-item" 
        v-for="post in blogposts" 
        :key="post.slug"
      >
      
       
          <div class="masonry-image">
            <NuxtImg
              :src="post.thumbnail"
              alt="Post thumbnail"
              class="w-full h-64 object-cover rounded-md mb-4"
              :width="750"
              :height="550"
            />
          </div>
          <NuxtLink :to="post._path" class="block">
          <div class="masonry-item-text p-4">
            <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
            <!-- Limiting the height of the description and making it responsive -->
            <p v-if="post.description" class="text-gray-600 line-clamp-3">{{ post.description }}</p>
            <ClientOnly >
              <article v-if="post.tags" class="text-xs mt-2">
                <li v-for="(item, index) in post.tags" :key="index" class="inline mr-2">
                  <NuxtLink :to="`/tags/${item}`">{{ item }}</NuxtLink>
                </li>

                
              </article>
            </ClientOnly>

            <p v-if="post.date" class="text-xs opacity-50 hover:opacity-100">last updated on: {{ formatDate(post.date) }}
            <span v-if="post.author" class="text-xs">authored by: {{ post.author }} </span>
          </p>
          </div>
        </NuxtLink>

       

      </div>
    </div>
  </main>
</div>
</template>

<script setup>
const { data: blogposts } = await useAsyncData('blogposts', () => {
  return queryContent('/blog').find()
})

// Function to format the date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long' };
  return new Date(date).toLocaleDateString(undefined, options);
}
</script>