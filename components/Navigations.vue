<template>
    <div class="opacity-80 animate-fade animate-once animate-delay-[10ms] pt-5">

      <div v-if="navigations.mainmenu.mainavigation_on_off">
        <div class="animate-fade animate-once animate-delay-[150ms]">
            <MainNavigation />
        </div>
      </div>

    </div>
</template>    

<script setup>
import { ref } from 'vue';
import MainNavigation from './global/navs/MainNavigation.vue';

const navigations = ref({});
// Use useFetch to load the JSON data from the public folder
const { data, error } = await useFetch('/_data/menus.json');

// Set the data to the navigations ref
if (data.value) {
  navigations.value = data.value;
} else if (error.value) {
  console.error('Error loading navigations:', error.value);
}
</script>


<style>
hr{
  opacity: .1;
}
</style>