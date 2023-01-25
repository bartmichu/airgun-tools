<template>

  <v-card class="mx-auto mt-16" variant="outlined">
    <v-layout>

      <!-- start bar -->
      <v-app-bar color="black" density="compact" elevation="0">

        <template v-slot:prepend>
          <v-icon icon="mdi-clock-fast"></v-icon>
        </template>

        <v-app-bar-title>Projectile velocity</v-app-bar-title>
      </v-app-bar>
      <!-- stop bar -->

      <v-main class="light-grey-background">
        <v-container fluid>

          <!-- start conversion row -->
          <v-row>

            <v-col cols="12" sm="6" md="5" lg="5">
              <v-container fluid>

                <!-- start section header -->
                <v-row>
                  <v-col cols="12">
                    <p class="text-h6">Velocity units converter</p>
                  </v-col>
                </v-row>
                <!-- end section header -->

                <!-- start conversion select -->
                <v-row>
                  <v-col cols="12">
                    <v-select density="comfortable" variant="solo" single-line v-model="conversionSelectModel.inputUnit"
                      :items="conversionSelectItems" item-title="conversionMethod" item-value="inputUnit">
                    </v-select>
                  </v-col>
                </v-row>
                <!-- end conversion select -->

                <!-- start conversion input -->
                <v-row>
                  <v-col cols="6">
                    <p>{{ getInputUnitName() }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="conversionSelectModel.inputUnit" :isReadOnly="false"
                      @confirmInput="addconversionData" v-model="conversionInputModel" />
                  </v-col>
                </v-row>
                <!-- end conversion input -->

                <!-- start ms output -->
                <v-row v-show="conversionSelectModel.inputUnit !== 'ms'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('ms') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'ms'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="msModel" />
                  </v-col>
                </v-row>
                <!-- end ms output -->

                <!-- start fps output -->
                <v-row v-show="conversionSelectModel.inputUnit !== 'fps'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('fps') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'fps'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="fpsModel" />
                  </v-col>
                </v-row>
                <!-- end fps output -->

                <!-- start add button -->
                <v-row>
                  <v-col cols="6"></v-col>
                  <v-col cols="6">
                    <v-btn block color="white" @click="addconversionData()">add to table</v-btn>
                  </v-col>
                </v-row>
                <!-- stop add button -->

              </v-container>
            </v-col>

            <!-- start spacer -->
            <v-col cols="12" sm="1" md="1" lg="1" class="d-sm-none d-md-flex">
              <v-spacer></v-spacer>
            </v-col>
            <!-- stop spacer -->

            <v-col cols="12" sm="6" md="6" lg="6">

              <!-- start table menu -->
              <v-toolbar density="compact" title="Conversion table" color="grey-lighten-3">
                <v-btn icon>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn dark v-bind="props" icon="mdi-menu">
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item>
                        <v-list-item-title @click="removeConversionData()">Remove all items</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </v-toolbar>
              <!-- stop table menu -->

              <!-- start conversion data table -->
              <v-table class="dark-grey-background">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ getInputUnitName('ms') }}</th>
                      <th class="text-left">{{ getInputUnitName('fps') }}</th>
                      <th class="text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in conversionTableModel" :key="item.ms">
                      <td>{{ item.ms }}</td>
                      <td>{{ item.fps }}</td>
                      <td>{{ item.comment }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
              <!-- stop conversion data table -->

              <!-- start conversion data placeholder -->
              <v-alert type="info" elevation="0" color="grey-lighten-3" v-show="(conversionTableModel.length === 0)">
                Use 'ADD TO TABLE' button to add some data
              </v-alert>
              <!-- stop conversion data placeholder -->

            </v-col>

          </v-row>
          <!-- stop conversion row -->

          <v-divider class="mt-10 mb-10"></v-divider>

          <!-- start calculation row -->
          <v-row>
            <v-col cols="12" sm="6" md="5" lg="5">
              <v-container fluid>

                <!-- start section header -->
                <v-row>
                  <v-col cols="12">
                    <p class="text-h6">Velocity calculator</p>
                  </v-col>
                </v-row>
                <!-- end section header -->

                <!-- start calculation select -->
                <v-row>
                  <v-col cols="12">
                    <v-select density="comfortable" variant="solo" single-line
                      v-model="calculationSelectModel.inputUnit" :items="calculationSelectItems"
                      item-title="calculationMethod" item-value="inputUnit">
                    </v-select>
                  </v-col>
                </v-row>
                <!-- end calculation select -->

                <!-- start energy input -->
                <v-row>
                  <v-col cols="6">
                    <p>Muzzle energy:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="getCalculationUnit('energy')" :isReadOnly="false"
                      @confirmInput="addCalculationData" v-model="energyInputModel" />
                  </v-col>
                </v-row>
                <!-- end energy input -->

                <!-- start weight input -->
                <v-row>
                  <v-col cols="6">
                    <p>Pellet weight:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="getCalculationUnit('weight')" :isReadOnly="false"
                      @confirmInput="addCalculationData" v-model="weightInputModel" />
                  </v-col>
                </v-row>
                <!-- end weight input -->

                <!-- start velocity output -->
                <v-row>
                  <v-col cols="6">
                    <p>Velocity:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="getCalculationUnit('velocity')" :isReadOnly="true"
                      @clickReadOnly="copyToClipboard($event)" v-model="velocityModel" />
                  </v-col>
                </v-row>
                <!-- end velocity output -->

                <!-- start add button -->
                <v-row>
                  <v-col cols="6"></v-col>
                  <v-col cols="6">
                    <v-btn block color="white" @click="addCalculationData()">add to
                      table</v-btn>
                  </v-col>
                </v-row>
                <!-- stop add button -->

              </v-container>
            </v-col>

            <!-- start spacer -->
            <v-col cols="12" sm="1" md="1" lg="1" class="d-sm-none d-md-flex">
              <v-spacer></v-spacer>
            </v-col>
            <!-- stop spacer -->

            <v-col cols="12" sm="6" md="6" lg="6">

              <!-- start table menu -->
              <v-toolbar density="compact" title="Calculation table" color="grey-lighten-3">
                <v-btn icon>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn dark v-bind="props" icon="mdi-menu">
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item>
                        <v-list-item-title @click="removeCalculationData()">Remove all items</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </v-toolbar>
              <!-- stop table menu -->

              <!-- start calculation data table -->
              <v-table class="dark-grey-background">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Energy</th>
                      <th class="text-left">Weight</th>
                      <th class="text-left">Velocity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in calculationTableModel" :key="item.energy">
                      <td>{{ item.energy }}</td>
                      <td>{{ item.weight }}</td>
                      <td>{{ item.velocity }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
              <!-- stop calculation data table -->

              <!-- start calculation data placeholder -->
              <v-alert type="info" elevation="0" color="grey-lighten-3" v-show="(calculationTableModel.length === 0)">
                Use 'ADD TO TABLE' button to add some data
              </v-alert>
              <!-- stop calculation data placeholder -->

            </v-col>

          </v-row>
          <!-- stop conversion row -->
        </v-container>
      </v-main>

    </v-layout>

    <!-- start notification -->
    <v-snackbar v-model="snackbarModel" :timeout="snackbarTimeout">
      {{ snackbarText }}
    </v-snackbar>
    <!-- stop notification -->

  </v-card>
</template>

<style>
.light-grey-background {
  background-color: rgb(248, 248, 248);
}

.dark-grey-background {
  background-color: #eee;
}
</style>

<script>
import { ref } from 'vue';
import AppConstants from '@/components/AppConstants';

export default {

  setup() {
    const conversionInputModel = ref();
    const weightInputModel = ref();
    const energyInputModel = ref();
    return { conversionInputModel, weightInputModel, energyInputModel };
  },

  data() {
    return {
      conversionTableModel: [
        {
          ms: '340.3',
          fps: '1116.524',
          comment: 'Mach = 1',
        },
      ],
      calculationTableModel: [],
      conversionSelectModel: {
        inputUnit: 'ms',
      },
      conversionSelectItems: [
        { conversionMethod: 'metre/second ➞ foot per second', inputUnit: 'ms' },
        { conversionMethod: 'foot per second ➞ metre/second', inputUnit: 'fps' },
      ],
      calculationSelectModel: {
        inputUnit: 'si',
      },
      calculationSelectItems: [
        { calculationMethod: 'Joule and gram ➞ m/s', inputUnit: 'si' },
        { calculationMethod: 'foot-pound and grain ➞ fps', inputUnit: 'us' },
      ],
      snackbarModel: false,
      snackbarText: '',
      snackbarTimeout: 1000,
      numberPattern: /^-?\d+\.?\d*$|^\d*\.?\d+$/,
    };
  },

  computed: {
    fpsModel: {
      get() {
        if (this.numberPattern.test(this.conversionInputModel) && Number(this.conversionInputModel) > 0) {
          if (this.conversionSelectModel.inputUnit === AppConstants.UNITS.ms.id) {
            return Number(parseFloat(this.conversionInputModel * 3.281).toFixed(3).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.conversionInputModel).toFixed(3).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    msModel: {
      get() {
        if (this.numberPattern.test(this.conversionInputModel) && Number(this.conversionInputModel) > 0) {
          if (this.conversionSelectModel.inputUnit === AppConstants.UNITS.fps.id) {
            return Number(parseFloat(this.conversionInputModel / 3.281).toFixed(3).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.conversionInputModel).toFixed(3).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    velocityModel: {
      get() {
        if (this.numberPattern.test(this.weightInputModel) && Number(this.weightInputModel) > 0 && this.numberPattern.test(this.energyInputModel) && Number(this.energyInputModel) > 0) {
          if (this.calculationSelectModel.inputUnit === 'si') {
            return parseFloat(Math.sqrt((2 * this.energyInputModel) / (this.weightInputModel / 1000))).toFixed(3).replace(/\.?0+$/, '');
          }

          if (this.calculationSelectModel.inputUnit === 'us') {
            return parseFloat(Math.sqrt((this.energyInputModel * 450240) / this.weightInputModel)).toFixed(3).replace(/\.?0+$/, '');
          }

          return 0;
        }

        return 0;
      },
    },
  },

  methods: {
    getInputUnitName(unit) {
      return AppConstants.UNITS?.[unit ?? this.conversionSelectModel.inputUnit]?.name ?? '';
    },
    copyToClipboard(event) {
      if (this.numberPattern.test(event.target.value)) {
        navigator.clipboard.writeText(event.target.value).then(
          () => {
            this.snackbarText = `'${event.target.value}' copied to clipboard`;
            this.snackbarModel = true;
          },
          () => {
            this.snackbarText = 'Clipboard write failed';
            this.snackbarModel = true;
          },
        );
      }
    },
    addconversionData() {
      if (this.msModel > 0 && this.fpsModel > 0) {
        this.conversionTableModel.push({ ms: this.msModel, fps: this.fpsModel });
        this.snackbarText = 'Item added';
        this.snackbarModel = true;
      } else {
        this.snackbarText = 'All values must be greater than zero';
        this.snackbarModel = true;
      }
    },
    removeConversionData() {
      if (this.conversionTableModel.length > 0) {
        this.conversionTableModel = [];
        this.snackbarText = 'All items removed';
        this.snackbarModel = true;
      }
    },
    addCalculationData() {
      if (this.numberPattern.test(this.energyInputModel) && Number(this.energyInputModel) > 0 && this.numberPattern.test(this.weightInputModel) && Number(this.weightInputModel) > 0 && this.velocityModel > 0) {
        this.calculationTableModel.push({ energy: Number(parseFloat(this.energyInputModel).toFixed(2).replace(/\.?0+$/, '')), weight: Number(parseFloat(this.weightInputModel).toFixed(3).replace(/\.?0+$/, '')), velocity: this.velocityModel });
        this.snackbarText = 'Item added';
        this.snackbarModel = true;
      } else {
        this.snackbarText = 'All values must be greater than zero';
        this.snackbarModel = true;
      }
    },
    removeCalculationData() {
      if (this.calculationTableModel.length > 0) {
        this.calculationTableModel = [];
        this.snackbarText = 'All items removed';
        this.snackbarModel = true;
      }
    },
    getCalculationUnit(element) {
      switch (this.calculationSelectModel.inputUnit) {
        case 'si':
          if (element === 'weight') {
            return AppConstants.UNITS.gram.id;
          }

          if (element === 'energy') {
            return AppConstants.UNITS.joule.id;
          }

          if (element === 'velocity') {
            return AppConstants.UNITS.ms.id;
          }

          return '';
        case 'us':
          if (element === 'weight') {
            return AppConstants.UNITS.grain.id;
          }

          if (element === 'energy') {
            return AppConstants.UNITS.ftlbf.id;
          }

          if (element === 'velocity') {
            return AppConstants.UNITS.fps.id;
          }

          return '';
        default:
          return '';
      }
    },
  },
};
</script>
