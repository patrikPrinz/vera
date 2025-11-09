import { createApp } from 'vue';
import { i18n } from './shared/i18n/index';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import './assets/styles/style.css';

import './assets/logo.png';

const app = createApp(App);

app.use(i18n);
app.use(router).mount('#app');
