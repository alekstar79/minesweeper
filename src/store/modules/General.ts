import { defineStore } from 'pinia'
import { THEME_MAP, TOAST_MSG } from '@/handler/constants'

type GeneralType = {
  theme: THEME_MAP;
  currentToast: TOAST_MSG | null;
}

const state = (): GeneralType => ({
  theme: THEME_MAP.LIGHT,
  currentToast: null,
})

export default defineStore('general', {
  state,
  actions: {
    setThemeAttr()
    {
      document.body.setAttribute('data-theme', this.theme)
    },
    toggleTheme()
    {
      this.theme === THEME_MAP.DARK ? (this.theme = THEME_MAP.LIGHT) : (this.theme = THEME_MAP.DARK)

      this.setThemeAttr()
    },
    addToast(msg: TOAST_MSG)
    {
      this.currentToast = msg
    },
    removeToast()
    {
      this.currentToast = null
    }
  }
})
