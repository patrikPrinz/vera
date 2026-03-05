import { createApp } from 'vue';
import { createTranslation } from './shared/i18n/index';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/styles/style.css';

import './assets/logo.png';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.use(Toast);
app.use(pinia);
app.use(await createTranslation());
app.use(router);

app.mount('#app');
