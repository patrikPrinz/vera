import { createApp } from 'vue';
import { createTranslation } from './shared/i18n/index';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/styles/style.css';
import 'vue-final-modal/style.css';

import './assets/logo.png';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal';

const pinia = createPinia();
const app = createApp(App);

const vfm = createVfm();
app.use(vfm).mount('#app');
app.use(Toast);
app.use(pinia);
app.use(await createTranslation());
app.use(router);

app.mount('#app');
