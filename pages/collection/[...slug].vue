<template>
  <div class="mb-20 animate-fade animate-once animate-delay-[500ms]">
    <ContentQuery :path="$route.path" find="one" v-slot="{ data }">
      <component
        :is="getLayoutComponent(data.layout)"
        :data="data"
        :formatDate="formatDate"
      />
    </ContentQuery>
  </div>
</template>

<script setup>
import Layout1 from '~/components/layouts/Layout1.vue';
import Layout2 from '~/components/layouts/Layout2.vue';
import Layout3 from '~/components/layouts/Layout3.vue';
import Layout4 from '~/components/layouts/Layout4.vue';
import Layout5 from '~/components/layouts/Layout5.vue';

// Function to get the corresponding layout component
function getLayoutComponent(layout) {
  switch (layout) {
    case 'layout1':
      return Layout1;
    case 'layout2':
      return Layout2;
    case 'layout3':
      return Layout3;
    case 'layout4':
      return Layout4;
    case 'layout5':
      return Layout5;    
    default:
      return null;
  }
}

// Function to format the date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long' };
  return new Date(date).toLocaleDateString(undefined, options);
}
</script>
