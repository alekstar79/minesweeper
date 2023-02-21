<template>
  <div class="theme-btn-wrapper">
    <button
      class="btn--theme"
      :class="{ dark: theme === THEME_MAP.DARK }"
      @click="toggleTheme"
    >
      <div class="dot"></div>
      <ion-icon name="sunny"></ion-icon>
      <ion-icon name="moon"></ion-icon>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useGeneral } from '@/store'
import { THEME_MAP } from '@/handler/constants'

const generalStore = useGeneral()
const { toggleTheme } = useGeneral()
const { theme } = storeToRefs(generalStore)
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss">
.theme-btn-wrapper {
  .btn--theme {
    position: relative;
    width: 1.4rem;
    height: 0.65rem;
    padding: 0 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5rem;
    box-shadow: $shadow-inner;
    &.dark {
      .dot {
        transform: translateX(0.7rem);
      }
      ion-icon {
        &[aria-label='sunny'] {
          opacity: 0.5;
        }
        &[aria-label='moon'] {
          opacity: 1;
        }
      }
    }
    ion-icon {
      color: orange;
      &[aria-label='sunny'] {
        opacity: 1;
      }
      &[aria-label='moon'] {
        opacity: 0.5;
      }
    }
    .dot {
      position: absolute;
      left: 0.1rem;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      box-shadow: $shadow-outer;
      transition: transform 0.3s;
    }
  }
}
</style>
