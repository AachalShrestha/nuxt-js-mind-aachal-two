<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Fetch JSON files
const homepageSettings = ref(null);
const generalSettings = ref(null);
const isLoading = ref(true);
const hasError = ref(false);

// Trail effect state
const mousePos = ref({ x: 0, y: 0 });
const trailImages = ref([
  { src: "/img/trail-img/trail-img1.png", x: 0, y: 0, scale: 1, opacity: 0 },
  { src: "/img/trail-img/trail-img2.png", x: 0, y: 0, scale: 1, opacity: 0 },
  { src: "/img/trail-img/trail-img3.png", x: 0, y: 0, scale: 1, opacity: 0 },
  { src: "/img/trail-img/trail-img4.png", x: 0, y: 0, scale: 1, opacity: 0 },
]);

let lastMouseMoveTime = 0; // Tracks the last mouse movement time

const updateMousePosition = (event) => {
  mousePos.value = { x: event.clientX, y: event.clientY };
  lastMouseMoveTime = performance.now();
};

const animateTrail = () => {
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const trailSpeed = 0.2;

  const currentTime = performance.now();
  const timeSinceLastMove = currentTime - lastMouseMoveTime;

  trailImages.value = trailImages.value.map((img, index) => {
    const targetX = index === 0 ? mousePos.value.x : trailImages.value[index - 1].x;
    const targetY = index === 0 ? mousePos.value.y : trailImages.value[index - 1].y;

    return {
      ...img,
      x: lerp(img.x, targetX, trailSpeed),
      y: lerp(img.y, targetY, trailSpeed),
      opacity: timeSinceLastMove < 50 ? 1 - index * 0.2 : 0, // Fade out if mouse hasn't moved in 100ms
      scale: 1 - index * 0.1,
    };
  });

  requestAnimationFrame(animateTrail);
};

// Set up and clean up
onMounted(() => {
  window.addEventListener("mousemove", updateMousePosition);
  animateTrail();
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", updateMousePosition);
});

onMounted(async () => {
  try {
    const homepageResponse = await fetch("/_data/homepage.json");
    const settingsResponse = await fetch("/_data/settings.json");

    if (!homepageResponse.ok || !settingsResponse.ok) {
      throw new Error("Failed to fetch settings");
    }

    homepageSettings.value = await homepageResponse.json();
    generalSettings.value = await settingsResponse.json();

    isLoading.value = false;
  } catch (error) {
    hasError.value = true;
    console.error("Error loading settings:", error);
  }
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex items-center justify-center h-screen">
      <p>Error loading settings. Please try again later.</p>
    </div>

    <!-- Main Content -->
    <div v-else class="h-screen relative">
      <!-- Background -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: homepageSettings?.thumbnail ? `url(${homepageSettings.thumbnail})` : 'none' }"
      ></div>

      <!-- Menu or Drawer -->
      <div class="relative z-10">
        <Drawer />
      </div>

      <!-- Title Section -->
      <div class="absolute bottom-7 left-7">
        <div class="container text-left">
          <div class="opacity-80 text-white">
            <div class="text-8xl font-bold">
              {{ generalSettings?.site_title || "Default Title" }}
            </div>
          </div>
        </div>
      </div>

      <!-- Trail Images -->
      <div class="trail-img-wrapper">
        <img
          v-for="(img, index) in trailImages"
          :key="index"
          :src="img.src"
          alt="Trail Image"
          class="trail-img"
          :style="{
            transform: `translate(${img.x}px, ${img.y}px) scale(${img.scale})`,
            opacity: img.opacity,
          }"
        />
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-[100vh] bg-[#F7DCE4]" style="z-index:-1;">
          <!-- Optional content inside the div, if needed -->
        </div>
  </div>
</template>

<style>
/* Trail Image Wrapper */
.trail-img-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
}

/* Trail Images */
.trail-img {
  position: absolute;
  max-height: 200px;
  will-change: transform, opacity;
  transition: opacity 0.2s linear;
  pointer-events: none;
}

</style>
