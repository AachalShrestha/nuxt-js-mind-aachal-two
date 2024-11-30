<template>
    <div class="fixed bottom-0  flex gap-2 justify-center flex-wrap p-2 pb-5 pt-5 opacity-10 hover:opacity-100 backcolor">
      <SocialShare
        v-for="network in ['facebook', 'x', 'linkedin', 'whatsapp']"
        :key="network"
        :network="network"
        :styled="false"
        :label="false"
        class="rounded-none text-xs"
      />
    </div>
  </template>
  
  <style>
  .share-buttons {
    display: flex;
    flex-wrap: wrap;
  }
  </style>
  