import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/router';
import './style.css';

const app = createApp(App);

declare global {
    interface Window {
        configApi: any
    }
}

app.use(createPinia());
app.use(router);
app.mount('#app');
