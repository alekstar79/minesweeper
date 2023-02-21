<template>
  <transition name="fadein">
    <div class="rule-wrapper" v-if="props.isOpen">
      <h3>
        <ion-icon :name="ruleData.icon"></ion-icon> {{ ruleData.device }} device
      </h3>

      <ol>
        <template v-for="(item, key) in ruleData.list" :key="key">
          <li v-if="item.display">
            <kbd>{{ item.kbd }}</kbd> {{ item.text }}
          </li>
        </template>
      </ol>

      <button class="btn--close" @click="$emit('closeRule')">
        <ion-icon name="close"></ion-icon>
      </button>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGame } from '@/store'

const gameStore = useGame()
const { isMobile } = storeToRefs(gameStore)

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const ruleData = computed(() => ({
  icon: isMobile.value ? 'phone-portrait-outline' : 'laptop-outline',
  device: isMobile.value ? 'mobile' : 'computer',
  list: [
    {
      kbd: isMobile.value ? 'click' : 'left-click',
      text: 'to reveal a grid',
      display: true
    },
    {
      kbd: isMobile.value ? 'long press' : 'right-click',
      text: 'to add/remove a flag',
      display: true
    },
    {
      kbd: 'double-click',
      text: 'on an opened grid to reveal non-flagged adjacent grids if the number on the grid equal to the number of adjacent flagged cells',
      display: !isMobile.value
    }
  ]
}))
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss">
.rule-wrapper {
  position: absolute;
  top: 100%;
  right: 100%;
  width: 4.5rem;
  padding: 0.3rem;
  font-size: 0.9em;
  line-height: 1.5;
  text-align: left;
  border-radius: $main-bdrs;
  @include backdropFilterBlur(8px);
  box-shadow: var(--popup-shadow);
  transform-origin: top right;
  z-index: 20;
  .btn--close {
    position: absolute;
    top: 0;
    right: 0;
    @include expandTriggerArea;
  }
  h3 {
    margin-bottom: 0.1rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  ol {
    margin: 0;
    padding-left: 0.3rem;
  }
  li {
    margin-bottom: 0.1rem;
  }
  kbd {
    font-weight: bold;
    background-image: linear-gradient(transparent 60%, rgba(orange, 0.5) 60%);
  }
}

.fadein-enter-active,
.fadein-leave-active {
  transition: all 0.3s;
}
.fadein-enter-from,
.fadein-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
