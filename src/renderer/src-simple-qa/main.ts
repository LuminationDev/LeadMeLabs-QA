import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '../src-qa/router/router';
import '../src-qa/style.css';
import App from "./App.vue";

const app = createApp(App);

declare global {
    interface Window {
        configApi: any
    }
}

app.use(createPinia());
app.use(router);
app.mount('#app');
