<template>
  <v-app>
    <!-- start main toolbar -->
    <v-app-bar color="red-darken-4">
      <v-container>
        <!-- <v-toolbar-title>Airgun Tools</v-toolbar-title> -->

        <v-tabs show-arrows slider-color="yellow" v-model="menuModel">
          <v-tab value="energy">Energy</v-tab>
          <v-tab value="velocity">Velocity</v-tab>
          <v-tab value="weight">Weight</v-tab>
          <v-tab value="distance">Distance</v-tab>
          <v-tab value="length">Length</v-tab>
        </v-tabs>
      </v-container>
    </v-app-bar>
    <!-- end main toolbar -->

    <v-container>
      <EnergyCalculator v-show="menuModel.includes('energy')" />
      <VelocityCalculator v-show="menuModel.includes('velocity')" />
      <DistanceCalculator v-show="menuModel.includes('distance')" />
      <LengthCalculator v-show="menuModel.includes('length')" />
      <WeightCalculator v-show="menuModel.includes('weight')" />
    </v-container>

    <v-footer class="text-center d-flex flex-column">
      <div>
        <v-btn size="small" color="black" variant="outlined" icon="mdi-github"
          href="https://github.com/bartmichu/airgun-tools" target="_blank"></v-btn>
      </div>
      <div>Improve me on GitHub!</div>
    </v-footer>
  </v-app>
</template>

<script setup>
import EnergyCalculator from '@/components/EnergyCalculator.vue';
import VelocityCalculator from '@/components/VelocityCalculator.vue';
import WeightCalculator from '@/components/WeightCalculator.vue';
import DistanceCalculator from '@/components/DistanceCalculator.vue';
import LengthCalculator from '@/components/LengthCalculator.vue';
</script>

<script>
export default {
  data() {
    return {
      // menuModel: ['energy', 'velocity', 'distance', 'length', 'weight'],
      menuModel: ['energy'],
    };
  },
};
</script>
