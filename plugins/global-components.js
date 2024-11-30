import { defineNuxtPlugin } from '#app';
import SearchBox from '../components/SearchBox.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('SearchBox', SearchBox);
});
