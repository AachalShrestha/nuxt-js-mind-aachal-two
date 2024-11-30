import { promises as fs } from 'fs';
import { join } from 'path';

export default defineNuxtPlugin(async (nuxtApp) => {
  const filePath = join(process.cwd(), '/public/_data', 'menus.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const menuData = JSON.parse(fileContent);

  // Provide the menu data globally
  nuxtApp.provide('menuData', menuData.menu);
});
