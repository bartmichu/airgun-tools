/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import { createApp } from 'vue';
import App from './App.vue';

// Custom components
import NumberInput from './components/NumberInput.vue';

// Composables

// Plugins
import { registerPlugins } from '@/plugins';

const app = createApp(App);

// Global registration of custom components
app.component('NumberInput', NumberInput);

registerPlugins(app);

app.mount('#app');
