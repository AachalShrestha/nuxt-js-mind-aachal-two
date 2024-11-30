<template>
  <div class="mb-10">
    <p class="text-xl font-bold mt-10 pb-5">Categories on items:</p>
    <ClientOnly>
    <!-- El-Select to select a folder or "All" -->
    <el-select v-model="selectedFolder" @change="updateTagCounts" placeholder="Select a folder" class="w-full pr-5">
      <el-option
        v-for="folder in folders"
        :key="folder.name"
        :label="folder.displayName"
        :value="folder.name"
        class="pr-5">
      </el-option>
    </el-select>

    <!-- Container with blend mode -->
    <div class="multiply-blend">
      <Pie 
        v-if="chartData.labels.length" 
        :data="chartData"
        class="m-2 mt-5 p-20"
        :options="{
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const tagName = context.label || 'Unknown';
                  const tagCount = context.raw || 0;
                  return `${tagName}: appears in ${tagCount} articles`;
                },
              },
            },
          },
        }" 
      />
    </div>
  </ClientOnly>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components required for a pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const folders = ref<{ name: string; displayName: string }[]>([]); // Array to store folder names and display names (first article title)
const selectedFolder = ref<string>('All'); // Store the currently selected folder, defaulting to "All"
const tagCounts = ref<{ [tag: string]: number }>({}); // Object to store tag counts for the selected folder or all folders
const chartData = ref<{ labels: string[], datasets: any[] }>({
  labels: [],
  datasets: [],
});

onMounted(async () => {
  try {
    // Fetch all folders in the content/folders directory
    const fetchedFolders = await queryContent('/')
      .only('_dir')  // Only get directories
      .find();

    // Filter out the 'tags' folder from the result
    const filteredFolders = fetchedFolders.filter(folder => folder._dir !== 'tags');
    // console.log(filteredFolders);

    // Create an array of folder names and their corresponding first article titles
    const folderDisplayNames = await Promise.all(filteredFolders.map(async (folder) => {
      const folderName = folder._dir;
      const files = await queryContent(`/folders/${folderName}`).find();

      // Determine the display name: the title of the first article, or fallback to folder name
      const displayName = files.length > 0 && files[0].title
        ? files[0].title
        : folderName;

      return { name: folderName, displayName };
    }));


    // Filter out folders with empty or "Unknown" labels
    let uniqueFolderDisplayNames = folderDisplayNames
      .filter(folder => folder.displayName && folder.displayName !== 'Unknown');

    // Remove duplicates based on display name
    uniqueFolderDisplayNames = uniqueFolderDisplayNames.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.displayName === value.displayName
      ))
    );

    // Add the "All" option
    folders.value = [{ name: 'All', displayName: 'All Items' }, ...uniqueFolderDisplayNames];

    // Load tag counts for all articles initially
    await updateTagCounts();
  } catch (error) {
    console.error('Error loading folders:', error);
  }
});

// Function to update tag counts based on the selected folder or all folders
const updateTagCounts = async () => {
  try {
    const newTagCounts: { [tag: string]: number } = {};

    if (selectedFolder.value === 'All') {
      // Fetch and count tags across all folders in the content/folders directory
      const allFiles = await queryContent('/').find();
      allFiles.forEach(file => {
        if (file.tags && Array.isArray(file.tags)) {
          file.tags.forEach(tag => {
            if (tag in newTagCounts) {
              newTagCounts[tag]++;
            } else {
              newTagCounts[tag] = 1;
            }
          });
        }
      });
    } else {
      // Fetch and count tags in the selected folder
      const files = await queryContent(`/folders/${selectedFolder.value}`).find();
      files.forEach(file => {
        if (file.tags && Array.isArray(file.tags)) {
          file.tags.forEach(tag => {
            if (tag in newTagCounts) {
              newTagCounts[tag]++;
            } else {
              newTagCounts[tag] = 1;
            }
          });
        }
      });
    }

    // Update tagCounts and chartData
    tagCounts.value = newTagCounts;
    chartData.value = {
      labels: Object.keys(tagCounts.value),
      datasets: [
        {
          label: 'Tag Usage',
          backgroundColor: [
            'rgba(224, 224, 224, 0.9)', // Light Grey with Transparency
            'rgba(192, 192, 192, 0.9)', // Silver with Transparency
            'rgba(160, 160, 160, 0.9)', // Grey with Transparency
            'rgba(128, 128, 128, 0.9)', // Dim Grey with Transparency
            'rgba(96, 96, 96, 0.9)',    // Dark Grey with Transparency
            'rgba(64, 64, 64, 0.9)',    // Dark Slate Grey with Transparency
            'rgba(32, 32, 32, 0.9)',    // Black with Transparency
          ],
          data: Object.values(tagCounts.value),
          borderWidth: 0,
        },
      ],
    };
  } catch (error) {
    console.error('Error updating tag counts:', error);
  }
};
</script>



<style>
.multiply-blend {
  mix-blend-mode: screen; /* Alternative blend mode */
  filter: brightness(.6) contrast(3) ;/* Adjusted filter for a distinct effect */
}

.multiply-blend {
  display: flex; /* Enable Flexbox layout */
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
  width: 100%; /* Ensure it takes the full width of its container */
  height: auto; /* Adjust height to content */
}

.light-mode el-option {
  background-color: #e2e3e5;
  color: #161717;
}

.dark-mode body {
  background-color: #161715;
  color: #ebf4f1;
}

</style>
