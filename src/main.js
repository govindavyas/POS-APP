import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// PrimeVue Theme and Core CSS
import 'primevue/resources/themes/saga-blue/theme.css';     // theme
import 'primevue/resources/primevue.css';                   // core css
import 'primeicons/primeicons.css';                        // icons

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Custom CSS
import './style.css';

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.mount('#app');
