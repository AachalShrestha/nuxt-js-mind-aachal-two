<template>
  <div class="overflow-x-auto mb-10">
    <p class="text-xl font-bold opacity-90 pb-5">Items, categories and tags</p>
    <table class="min-w-full divide-y divide-gray-300 table-transparent">
      <thead class="mb-20 opacity-40">
        <tr>
          <th class="py-2 text-left text-xs font-medium">Type</th>
          <th class="py-2 text-left text-xs font-medium">Nr of items</th>
          <th class="py-2 text-left text-xs font-medium">Nr of tags</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="folder in folderDetails" :key="folder.title">
          <td class="py-2 whitespace-nowrap text-sm font-medium ">
            <router-link :to="folder.link">{{ folder.title }}</router-link>
          </td>
          <td class="py-2 whitespace-nowrap text-sm ">{{ folder.articleCount }}</td>
          <td class="py-2 whitespace-nowrap text-sm ">{{ folder.uniqueTagsCount }}</td>
        </tr>
        <tr class="opacity-40">
          <td class="py-2 whitespace-nowrap text-sm font-bold ">Total</td>
          <td class="py-2 whitespace-nowrap text-sm font-bold">{{ totalArticleCount }}</td>
          <td class="py-2 whitespace-nowrap text-sm font-bold">{{ totalUniqueTagsCount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface FolderDetails {
  title: string;        // Directory name as title
  articleCount: number; // Number of articles in the folder
  uniqueTagsCount: number; // Number of unique tags in the folder
  link: string;         // Link to the folder or first article
}

// Reactive references to store folder details and totals
const folderDetails = ref<FolderDetails[]>([]);
const totalArticleCount = ref(0);
const totalUniqueTagsCount = ref(0);

onMounted(async () => {
  try {
    // Fetch all folder names from the content/folders directory
    const folderData = await queryContent('/')
      .only('_dir')  // Only get directories
      .find();

    // Filter out the 'tags' folder from the result
    const filteredFolders = folderData.filter(folder => folder._dir !== 'tags');
    // console.log(filteredFolders);

    // Extract unique folder names
    const folderNames = [...new Set(filteredFolders.map(folder => folder._dir).filter(Boolean))];

    // Initialize an array to store folder details
    const details: FolderDetails[] = [];
    let totalArticles = 0;
    let totalTags = new Set<string>();

    // Process each folder name
    for (const folderName of folderNames) {
      // Fetch all articles in the current folder, excluding index.md
      const articles = await queryContent(`/${folderName}`).where({ _file: { $ne: 'index.md' } }).find();
      // console.log( articles)

      // Use the folder name as the title
      const folderTitle = folderName || 'Untitled Folder';
      
      // Create a link to the folder or the first article
      const firstArticleLink = articles.length > 0 ? `${articles[0]._path}` : '#';

      // Count the number of articles in the current folder
      const articleCount = articles.length;

      // Count unique tags
      const uniqueTags = new Set<string>();
      articles.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach(tag => {
            uniqueTags.add(tag);
            totalTags.add(tag); // Add to global unique tag set
          });
        }
      });

      // Only include folders with valid articles
      if (articleCount > 0) {
        details.push({
          title: folderTitle, // Set the title as the folder name
          articleCount: articleCount,
          uniqueTagsCount: uniqueTags.size,
          link: firstArticleLink,
        });
      }

      // Accumulate totals
      totalArticles += articleCount;
    }

    // Update the reactive references
    folderDetails.value = details;
    totalArticleCount.value = totalArticles;
    totalUniqueTagsCount.value = totalTags.size;

    // console.log(folderData)
    // console.log(folderNames)

  } catch (error) {
    console.error('Error loading folders or counting articles and tags:', error);
    // Handle error as needed
  }
});
</script>
