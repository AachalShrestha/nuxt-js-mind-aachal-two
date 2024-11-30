<template>
  <div
    v-if="isVisible"
    class="modal-overlay animate-fade animate-once animate-delay-[20ms]"
    @click.self="close"
  >
    <div class="modal-content"> 

      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits<{
  (event: 'update:isVisible', value: boolean): void;
}>();

const close = () => {
  emit('update:isVisible', false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 1rem;
  border-radius: 2px;
  position: relative;
}

.dark-mode .modal-content {
  background: black;
  padding: 1rem;
  border-radius: 2px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: red;
}
</style>
