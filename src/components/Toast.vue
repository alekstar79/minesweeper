<template>
  <transition name="fadein-top">
    <div class="toast-wrapper" v-if="currentToast">
      {{ currentToast }}

      <button class="btn--close" @click="clearToastStatus">
        <ion-icon name="close"></ion-icon>
      </button>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGeneral } from '@/store'

const generalStore = useGeneral()
const { removeToast } = useGeneral()
const { currentToast } = storeToRefs(generalStore)

const timer = ref<ReturnType<typeof setTimeout> | null>(null)

const clearTimer = () => {
  clearInterval(timer.value as ReturnType<typeof setTimeout>)
}

const clearToastStatus = () => {
  clearTimer()
  removeToast()
}

watch(
  () => currentToast.value,

  (val) => {
    if (val) {
      clearTimer()

      timer.value = setTimeout(() => {
        clearToastStatus()
      }, 5000)
    }
  }
)

onUnmounted(() => {
  clearTimer()
})
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss">
.toast-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 5rem;
  height: 1rem;
  @include flexCenter;
  padding: .1rem .5rem .1rem .1rem;
  border-radius: 0.1rem;
  @include backdropFilterBlur(8px);
  box-shadow: var(--popup-shadow);
  z-index: 10;
  .btn--close {
    position: absolute;
    right: 0.1rem;
    top: 0;
    bottom: 0;
    margin: auto;
    @include expandTriggerArea;
  }
}

.fadein-top-enter-active,
.fadein-top-leave-active {
  transition: all 0.5s;
}
.fadein-top-enter-from,
.fadein-top-leave-to {
  opacity: 0;
  transform: translateY(-30%);
}
</style>
