import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import '@/styles/global.scss';

createApp(App).use(createPinia()).mount('#app');
