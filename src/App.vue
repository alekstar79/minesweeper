<template>
  <div class="main">
    <Navbar />
    <PlayInfo />
    <Playground />
  </div>
</template>

<script lang="ts" setup>
import Playground from '@/components/Playground.vue';
import PlayInfo from '@/components/PlayInfo.vue';
import Navbar from '@/components/Navbar.vue';
import { useGeneral, useGame } from '@/store';
import { onMounted } from 'vue';

const { initBoard, checkDeviceInfo } = useGame();
const { setThemeAttr } = useGeneral();

onMounted(() => {
  setThemeAttr();
  checkDeviceInfo();
  initBoard();
});
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  padding: 0.3rem;
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-color);
  font-size: max(0.24rem, 14px);
  background-color: var(--bg-color);
  overflow-x: hidden;
  overflow-y: auto;
  transition: background-color 0.1s;
  // prevent touch selecting on mobile
  user-select: none;
  -webkit-touch-callout: none;
  .main {
    position: relative;
    max-width: 14rem;
    margin: auto;
  }
}
</style>
