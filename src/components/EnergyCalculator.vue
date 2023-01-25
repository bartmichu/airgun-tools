<template>

  <v-card class="mx-auto mt-16" variant="outlined">
    <v-layout>

      <!-- start bar -->
      <v-app-bar color="black" density="compact" elevation="0">

        <template v-slot:prepend>
          <v-icon icon="mdi-drag-variant"></v-icon>
        </template>

        <v-app-bar-title>Muzzle energy</v-app-bar-title>
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
                    <p class="text-h6">Energy units converter</p>
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

                <!-- start joule output -->
                <v-row v-show="conversionSelectModel.inputUnit !== 'joule'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('joule') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'joule'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="jouleModel" />
                  </v-col>
                </v-row>
                <!-- end joule output -->

                <!-- start ft-lbf output -->
                <v-row v-show="conversionSelectModel.inputUnit !== 'ftlbf'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('ftlbf') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'ftlbf'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="ftlbfModel" />
                  </v-col>
                </v-row>
                <!-- end ft-lbf output -->

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
                      <th class="text-left">{{ getInputUnitName('joule') }}</th>
                      <th class="text-left">{{ getInputUnitName('ftlbf') }}</th>
                      <th class="text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in conversionTableModel" :key="item.ms">
                      <td>{{ item.joule }}</td>
                      <td>{{ item.ftlbf }}</td>
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
                    <p class="text-h6">Energy calculator</p>
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

                <!-- start velocity input -->
                <v-row>
                  <v-col cols="6">
                    <p>Velocity:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="getCalculationUnit('velocity')" :isReadOnly="false"
                      @confirmInput="addCalculationData" v-model="velocityInputModel" />
                  </v-col>
                </v-row>
                <!-- end velocity input -->

                <!-- start energy output -->
                <v-row>
                  <v-col cols="6">
                    <p>Energy:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="getCalculationUnit('energy')" :isReadOnly="true"
                      @clickReadOnly="copyToClipboard($event)" v-model="energyModel" />
                  </v-col>
                </v-row>
                <!-- end energy output -->

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
                      <th class="text-left">Weight</th>
                      <th class="text-left">Velocity</th>
                      <th class="text-left">Energy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in calculationTableModel" :key="item.energy">
                      <td>{{ item.weight }}</td>
                      <td>{{ item.velocity }}</td>
                      <td>{{ item.energy }}</td>
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
    const velocityInputModel = ref();
    return { conversionInputModel, weightInputModel, velocityInputModel };
  },

  data() {
    return {
      conversionTableModel: [
        {
          joule: '7',
          ftlbf: '5.162',
          comment: 'Germany',
        },
        {
          joule: '16',
          ftlbf: '11.799',
          comment: 'UK',
        },
        {
          joule: '17',
          ftlbf: '12.537',
          comment: 'Poland',
        },
      ],
      calculationTableModel: [],
      conversionSelectModel: {
        inputUnit: 'joule',
      },
      conversionSelectItems: [
        { conversionMethod: 'Joule ➞ foot-pound', inputUnit: 'joule' },
        { conversionMethod: 'foot-pound ➞ Joule', inputUnit: 'ftlbf' },
      ],
      calculationSelectModel: {
        inputUnit: 'si',
      },
      calculationSelectItems: [
        { calculationMethod: 'gram and m/s ➞ Joule', inputUnit: 'si' },
        { calculationMethod: 'grain and fps ➞ foot-pound', inputUnit: 'us' },
      ],
      snackbarModel: false,
      snackbarText: '',
      snackbarTimeout: 1000,
      numberPattern: /^-?\d+\.?\d*$|^\d*\.?\d+$/,
    };
  },

  computed: {
    ftlbfModel: {
      get() {
        if (this.numberPattern.test(this.conversionInputModel) && Number(this.conversionInputModel) > 0) {
          if (this.conversionSelectModel.inputUnit === AppConstants.UNITS.joule.id) {
            return Number(parseFloat(this.conversionInputModel / 1.356).toFixed(3).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.conversionInputModel).toFixed(3).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    jouleModel: {
      get() {
        if (this.numberPattern.test(this.conversionInputModel) && Number(this.conversionInputModel) > 0) {
          if (this.conversionSelectModel.inputUnit === AppConstants.UNITS.ftlbf.id) {
            return Number(parseFloat(this.conversionInputModel * 1.356).toFixed(3).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.conversionInputModel).toFixed(3).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    energyModel: {
      get() {
        if (this.numberPattern.test(this.weightInputModel) && Number(this.weightInputModel) > 0 && this.numberPattern.test(this.velocityInputModel) && Number(this.velocityInputModel) > 0) {
          if (this.calculationSelectModel.inputUnit === 'si') {
            return Number(parseFloat(((this.weightInputModel / 1000) / 2) * (this.velocityInputModel ** 2)).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.calculationSelectModel.inputUnit === 'us') {
            return Number(parseFloat((this.weightInputModel * (this.velocityInputModel ** 2)) / (14000 * 32.174)).toFixed(2).replace(/\.?0+$/, ''));
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
      if (this.jouleModel > 0 && this.ftlbfModel > 0) {
        this.conversionTableModel.push({ joule: this.jouleModel, ftlbf: this.ftlbfModel });
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
      if (this.numberPattern.test(this.velocityInputModel) && Number(this.velocityInputModel) > 0 && this.numberPattern.test(this.weightInputModel) && Number(this.weightInputModel) > 0 && this.energyModel > 0) {
        this.calculationTableModel.push({ weight: Number(parseFloat(this.weightInputModel).toFixed(3).replace(/\.?0+$/, '')), velocity: Number(parseFloat(this.velocityInputModel).toFixed(3).replace(/\.?0+$/, '')), energy: this.energyModel });
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
