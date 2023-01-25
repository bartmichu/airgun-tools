<template>

  <v-card class="mx-auto mt-16" variant="outlined">
    <v-layout>

      <!-- start bar -->
      <v-app-bar color="black" density="compact" elevation="0">

        <template v-slot:prepend>
          <v-icon icon="mdi-map-marker-distance"></v-icon>
        </template>

        <v-app-bar-title>Shooting distance</v-app-bar-title>
      </v-app-bar>
      <!-- stop bar -->

      <v-main class="light-grey-background">
        <v-container fluid>
          <v-row>

            <v-col cols="12" sm="6" md="5" lg="4">
              <v-container fluid>

                <!-- start section header -->
                <v-row>
                  <v-col cols="12">
                    <p class="text-h6">Distance units converter</p>
                  </v-col>
                </v-row>
                <!-- end section header -->

                <!-- start conversion select -->
                <v-row>
                  <v-col cols="12">
                    <v-select density="comfortable" variant="solo" single-line v-model="selectModel.inputUnit"
                      :items="selectItems" item-title="conversionMethod" item-value="inputUnit">
                    </v-select>
                  </v-col>
                </v-row>
                <!-- end conversion select -->

                <!-- start main input -->
                <v-row>
                  <v-col cols="4">
                    <p>{{ getInputUnitName() }}:</p>
                  </v-col>

                  <v-col cols="8">
                    <NumberInput :unit="selectModel.inputUnit" :isReadOnly="false" @confirmInput="addConversionData"
                      v-model="inputModel" />
                  </v-col>
                </v-row>
                <!-- end main input -->

                <!-- start metre output -->
                <v-row v-show="selectModel.inputUnit !== 'metre'">
                  <v-col cols="4">
                    <p>{{ getInputUnitName('metre') }}:</p>
                  </v-col>

                  <v-col cols="8">
                    <NumberInput :unit="'metre'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="metreModel" />
                  </v-col>
                </v-row>
                <!-- end metre output -->

                <!-- start yard output -->
                <v-row v-show="selectModel.inputUnit !== 'yard'">
                  <v-col cols="4">
                    <p>{{ getInputUnitName('yard') }}:</p>
                  </v-col>

                  <v-col cols="8">
                    <NumberInput :unit="'yard'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="yardModel" />
                  </v-col>
                </v-row>
                <!-- end yard output -->

                <!-- start foot output -->
                <v-row v-show="selectModel.inputUnit !== 'foot'">
                  <v-col cols="4">
                    <p>{{ getInputUnitName('foot') }}:</p>
                  </v-col>

                  <v-col cols="8">
                    <NumberInput :unit="'foot'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="footModel" />
                  </v-col>
                </v-row>
                <!-- end foot output -->

                <!-- start add button -->
                <v-row>
                  <v-col cols="4"></v-col>
                  <v-col cols="8">
                    <v-btn block color="white" @click="addConversionData()">add to table</v-btn>
                  </v-col>
                </v-row>
                <!-- stop add button -->

              </v-container>
            </v-col>

            <!-- start spacer -->
            <v-col cols="12" sm="1" md="2" lg="3" class="d-sm-none d-md-flex">
              <v-spacer></v-spacer>
            </v-col>
            <!-- stop spacer -->

            <v-col cols="12" sm="6" md="5" lg="5">

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

              <!-- start data table -->
              <v-table class="dark-grey-background">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ getInputUnitName('metre') }}</th>
                      <th class="text-left">{{ getInputUnitName('yard') }}</th>
                      <th class="text-left">{{ getInputUnitName('foot') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in tableModel" :key="item.metre">
                      <td>{{ item.metre }}</td>
                      <td>{{ item.yard }}</td>
                      <td>{{ item.foot }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
              <!-- stop data table -->

              <!-- start data placeholder -->
              <v-alert type="info" elevation="0" color="grey-lighten-3" v-show="(tableModel.length === 0)">
                Use 'ADD TO TABLE' button to add some data
              </v-alert>
              <!-- stop data placeholder -->

            </v-col>

          </v-row>
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
    const inputModel = ref();
    return { inputModel };
  },

  data() {
    return {
      tableModel: [
        {
          metre: '10',
          yard: '10.94',
          foot: '32.81',
        },
        {
          metre: '30',
          yard: '32.82',
          foot: '98.43',
        },
        {
          metre: '50',
          yard: '54.7',
          foot: '164.05',
        },
        {
          metre: '100',
          yard: '109.4',
          foot: '328.1',
        },
        {
          metre: '9.14',
          yard: '10',
          foot: '30',
        },
        {
          metre: '27.42',
          yard: '30',
          foot: '90',
        },
        {
          metre: '45.7',
          yard: '50',
          foot: '150',
        },
        {
          metre: '91.41',
          yard: '100',
          foot: '300',
        },
      ],
      selectModel: {
        inputUnit: 'metre',
      },
      selectItems: [
        { conversionMethod: 'metre ➞ yard and foot', inputUnit: 'metre' },
        { conversionMethod: 'yard ➞ metre and foot', inputUnit: 'yard' },
        { conversionMethod: 'foot ➞ metre and yard', inputUnit: 'foot' },
      ],
      snackbarModel: false,
      snackbarText: '',
      snackbarTimeout: 1000,
      numberPattern: /^-?\d+\.?\d*$|^\d*\.?\d+$/,
    };
  },

  computed: {
    metreModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.yard.id) {
            return Number(parseFloat(this.inputModel / 1.094).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.selectModel.inputUnit === AppConstants.UNITS.foot.id) {
            return Number(parseFloat(this.inputModel / 3.281).toFixed(2).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.inputModel).toFixed(2).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    yardModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.metre.id) {
            return Number(parseFloat(this.inputModel * 1.094).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.selectModel.inputUnit === AppConstants.UNITS.foot.id) {
            return Number(parseFloat(this.inputModel / 3).toFixed(2).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.inputModel).toFixed(2).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    footModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.metre.id) {
            return Number(parseFloat(this.inputModel * 3.281).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.selectModel.inputUnit === AppConstants.UNITS.yard.id) {
            return Number(parseFloat(this.inputModel * 3).toFixed(2).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.inputModel).toFixed(2).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
  },

  methods: {
    getInputUnitName(unit) {
      return AppConstants.UNITS?.[unit ?? this.selectModel.inputUnit]?.name ?? '';
    },
    copyToClipboard(event) {
      if (this.numberPattern.test(event.target.value)) {
        navigator.clipboard.writeText(event.target.value).then(
          () => {
            // FIXME: timeout reset doesn't work
            // if (this.snackbarModel === true) {
            //   this.snackbarModel = false;
            //   this.snackbarTimeout = 0;
            //   this.snackbarTimeout = 1000;
            // }

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
    addConversionData() {
      if (this.metreModel > 0 && this.yardModel > 0 && this.footModel > 0) {
        this.tableModel.push({ metre: this.metreModel, yard: this.yardModel, foot: this.footModel });
        this.snackbarText = 'Item added';
        this.snackbarModel = true;
      } else {
        this.snackbarText = 'All values must be greater than zero';
        this.snackbarModel = true;
      }
    },
    removeConversionData() {
      if (this.tableModel.length > 0) {
        this.tableModel = [];
        this.snackbarText = 'All items removed';
        this.snackbarModel = true;
      }
    },
  },
};
</script>
