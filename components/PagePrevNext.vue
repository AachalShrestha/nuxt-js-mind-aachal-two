<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Modal from './Modal.vue'; // Adjust the path as needed

const route = useRoute();
const { prev, next } = useContent()

const folderName = route.path.split('/')[1]; // Extract folder name from current route
const folderTitle = ref('');
const firstFileLink = ref('');
const firstFileDescription = ref(''); // New ref for description
const folderpath = ref('');
const folderTOC = ref<Array<{ title: string, path: string, description: string }>>([]);
const isModalVisible = ref(false);
const descriptionVisibility = ref<{ [key: string]: boolean }>({}); // Manage visibility of descriptions

const openModal = () => {
  isModalVisible.value = true;
};

const toggleDescription = (path: string) => {
  // Hide all descriptions
  for (const key in descriptionVisibility.value) {
    descriptionVisibility.value[key] = false;
  }
  // Show the selected description
  descriptionVisibility.value[path] = true;
};

onMounted(async () => {
    folderpath.value = `content/${folderName}`
    try {
      // Fetch files from the folder
      const files = await queryContent(`/${folderName}`).find();
      if (files.length > 0) {
        const firstFile = files[0];
        firstFileLink.value = firstFile._path;
        folderTitle.value = firstFile.title;
        firstFileDescription.value = firstFile.description || ''; // Extract description

        // Populate the table of contents
        folderTOC.value = files.map(file => ({
          title: file.title, // Assuming each file has a 'title' property
          path: file._path, // Path to the file
          description: file.description || '', // Add description if available
        }));

        // Initialize description visibility state
        files.forEach(file => {
          descriptionVisibility.value[file._path] = false;
        });
      }
  } catch (error) {
    console.error('Error reading folder content:', error);
    // Handle error as needed
  }
});
</script>



<template>
  <div class="animate-fade animate-once animate-delay-[500ms]">


    <!-- Modal Component -->
    <Modal :isVisible="isModalVisible" @update:isVisible="isModalVisible = $event">
      <div class="modal-content p-10">
        <h1 class="font-bold text-lg">{{ folderTitle }}</h1>
        <p class="text-xs pb-5 w-96" v-if="firstFileDescription">{{ firstFileDescription }}</p>

        <ul>
          <li v-for="item in folderTOC" :key="item.path" class="text-sm relative">
            <div @click="toggleDescription(item.path)" class="cursor-pointer flex justify-between items-center">
              <NuxtLink :to="item.path">
                {{ item.title }}
              </NuxtLink>
              <svg v-if="descriptionVisibility[item.path]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="m6.523 12.5l3.735 3.735q.146.146.153.344q.006.198-.153.363q-.166.166-.357.168t-.357-.162l-4.382-4.383q-.243-.242-.243-.565t.243-.566l-4.382-4.382q-.147-.146-.347-.153q-.201-.007-.367.159q-.16.165-.162.353q-.003.189.162.354L6.523 11.5h12.38q.214 0 .358.143t.143.357t-.143.357t-.357.143z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 17.308L6.692 12l.708-.708l4.1 4.1V5.5h1v9.892l4.1-4.1l.708.708z"></path>
              </svg>
            </div>
            <p v-show="descriptionVisibility[item.path]" class="text-xs opacity-80 mb-5 w-96">
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </Modal>


    <div class="flex pt-5">
      <!-- First Column: Align SVG icon to the left edge -->
      <div class="flex-col basis-1/12 flex items-center justify-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.904 17.308L4.596 12l5.308-5.308l.708.72L6.523 11.5h12.88v1H6.524l4.089 4.089z"></path>
        </svg>
      </div>

      <!-- Middle Column: Center content -->
      <div class="flex-col basis-10/12 flex items-center justify-center">
        <svg @click="openModal" xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M13.885 9.592v-.93q.806-.408 1.726-.612t1.889-.204q.554 0 1.064.071q.509.072 1.052.202v.908q-.524-.167-1.02-.232q-.498-.064-1.096-.064q-.97 0-1.892.218q-.924.218-1.724.643m0 5.462v-.97q.768-.407 1.717-.611t1.899-.204q.554 0 1.064.072q.509.07 1.052.201v.908q-.524-.167-1.02-.232q-.498-.064-1.096-.064q-.97 0-1.892.235q-.924.234-1.724.665m0-2.712v-.969q.806-.408 1.726-.611t1.89-.204q.554 0 1.063.07q.51.072 1.052.203v.908q-.523-.168-1.02-.232q-.497-.065-1.095-.065q-.97 0-1.892.238q-.924.237-1.724.662M6.5 16.038q1.31 0 2.547.301t2.453.98V7.508q-1.083-.773-2.386-1.16q-1.305-.386-2.614-.386q-.9 0-1.576.107t-1.501.4q-.23.077-.327.222Q3 6.835 3 7.008v9.015q0 .27.192.394t.423.03q.548-.185 1.267-.297t1.618-.111m6 1.28q1.216-.678 2.453-.98t2.547-.3q.9 0 1.618.111t1.267.296q.23.096.423-.029t.192-.394V7.008q0-.173-.096-.308q-.096-.134-.327-.23q-.825-.293-1.501-.4T17.5 5.961q-1.31 0-2.613.386q-1.304.387-2.387 1.16zm-.5 1.45q-1.22-.834-2.62-1.282t-2.88-.448q-.78 0-1.534.13q-.753.131-1.466.42q-.544.217-1.022-.131T2 16.496V6.831q0-.371.195-.689t.547-.442q.881-.388 1.833-.563T6.5 4.962q1.47 0 2.866.423q1.398.423 2.634 1.23q1.237-.807 2.634-1.23t2.866-.423q.973 0 1.925.175t1.833.563q.352.125.547.442t.195.689v9.665q0 .614-.516.943q-.517.328-1.1.111q-.693-.27-1.418-.39q-.724-.121-1.466-.121q-1.48 0-2.88.448T12 18.769m-4.75-7.253"></path>
        </svg>
      </div>

      <!-- Last Column: Align SVG icon to the right edge -->
      <div class="flex-col basis-1/12 flex items-center justify-end">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
          <path fill="currentColor" d="m13.692 17.308l-.707-.72l4.088-4.088H5v-1h12.073l-4.088-4.088l.707-.72L19 12z"></path>
        </svg>
      </div>
    </div>

    <div class="flex leading-3 pt-5 pb-10">
      <div class="flex-col basis-2/12">
        <NuxtLink v-if="prev" :to="prev._path" class="text-xs">{{ prev.title }}</NuxtLink>
      </div>
      <div class="flex-col basis-8/12 text-center text-xs">
        <NuxtLink :to="firstFileLink">
          <span class="font-bold "> {{ folderTitle }}</span>
        </NuxtLink>
      </div>
      <div class="flex-col basis-2/12 text-right">
        <NuxtLink v-if="next" :to="next._path" class="text-xs">{{ next.title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal Overlay Styles */
.modal-content {
  max-height: 80vh; /* Adjust height as needed */
  overflow-y: auto; /* Enable vertical scrolling */
  position: relative;
}

/* Ensure the modal is centered */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


