<template>
  <div class="info-wrapper">
    <div class="info__item">
      <div class="title"><ion-icon name="time-outline"></ion-icon>time</div>
      <div class="content">{{ timeCount }}</div>
    </div>

    <div class="info__item">
      <div class="title"><ion-icon name="fitness-outline"></ion-icon>mines</div>
      <div class="content">{{ remainMines }}</div>
    </div>

    <button
      :disabled="gameStatus === GAME_STATUS.DEFAULT || gameStatus === GAME_STATUS.PLAY"
      @click="gameStore.handleReset"
      class="info__item btn--reset"
    >
      <ion-icon name="game-controller"></ion-icon>reset
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGame } from '@/store'

import { GAME_STATUS } from '@/handler/constants'

const gameStore = useGame()
const { remainMines, gameStatus } = storeToRefs(gameStore)

const timer = ref<ReturnType<typeof setInterval> | null>(null)
const timeCount = ref<number>(0)

const clearTimer = () => {
  clearInterval(timer.value as ReturnType<typeof setInterval>)
}

watch(
  () => gameStatus.value,

  (val) => {
    if (val === GAME_STATUS.DEFAULT) {
      timeCount.value = 0

    } else if (val === GAME_STATUS.PLAY) {
      clearTimer()

      timer.value = setInterval(() => {
        timeCount.value++
      }, 1000)
    } else {
      clearTimer()
    }
  }
)

onUnmounted(() => {
  clearTimer()
})
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss">
.info-wrapper {
  width: 7rem;
  height: 1rem;
  margin: auto auto .2rem;
  padding: 0.1rem 0;
  @include flexCenter;
  border-radius: $main-bdrs;
  box-shadow: $shadow-outer;
  .info__item {
    position: relative;
    flex: 1;
    height: 100%;
    margin: 0 0.3rem;
    padding-top: 0.3rem;
    @include flexCenter;
    text-transform: uppercase;
    overflow: hidden;
    ion-icon {
      margin-right: 0.05rem;
    }
    .title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: max(0.9em, 12px);
      text-decoration: underline;
    }
    .content {
      color: #4d8bbf;
      font-weight: bold;
    }
  }
  .btn--reset {
    height: auto;
    padding: 0.2rem 0.1rem;
    border-radius: inherit;
    color: #4d8bbf;
    box-shadow: inherit;
    &:disabled {
      box-shadow: $shadow-inner;
      color: #aaa;
    }
  }
}
</style>
