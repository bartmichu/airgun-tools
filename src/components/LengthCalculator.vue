<template>

  <v-card class="mx-auto mt-16" variant="outlined">
    <v-layout>

      <!-- start bar -->
      <v-app-bar color="black" density="compact" elevation="0">

        <template v-slot:prepend>
          <v-icon icon="mdi-ruler"></v-icon>
        </template>

        <v-app-bar-title>Barrel length</v-app-bar-title>
      </v-app-bar>
      <!-- stop bar -->

      <v-main class="light-grey-background">
        <v-container fluid>
          <v-row>

            <v-col cols="12" sm="6" md="5" lg="5">
              <v-container fluid>

                <!-- start section header -->
                <v-row>
                  <v-col cols="12">
                    <p class="text-h6">Length units converter</p>
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
                  <v-col cols="6">
                    <p>{{ getInputUnitName() }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="selectModel.inputUnit" :isReadOnly="false" @confirmInput="addConversionData"
                      v-model="inputModel" />
                  </v-col>
                </v-row>
                <!-- end main input -->

                <!-- start inch output -->
                <v-row v-show="selectModel.inputUnit !== 'inch'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('inch') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'inch'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="inchModel" />
                  </v-col>
                </v-row>
                <!-- end inch output -->

                <!-- start millimetre output -->
                <v-row v-show="selectModel.inputUnit !== 'millimetre'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('millimetre') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'millimetre'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="millimetreModel" />
                  </v-col>
                </v-row>
                <!-- end millimetre output -->

                <!-- start centimetre output -->
                <v-row v-show="selectModel.inputUnit !== 'centimetre'">
                  <v-col cols="6">
                    <p>{{ getInputUnitName('centimetre') }}:</p>
                  </v-col>

                  <v-col cols="6">
                    <NumberInput :unit="'centimetre'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="centimetreModel" />
                  </v-col>
                </v-row>
                <!-- end centimetre output -->

                <!-- start add button -->
                <v-row>
                  <v-col cols="6"></v-col>
                  <v-col cols="6">
                    <v-btn block color="white" @click="addConversionData()">add to table</v-btn>
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

              <!-- start data table -->
              <v-table class="dark-grey-background">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ getInputUnitName('millimetre') }}</th>
                      <th class="text-left">{{ getInputUnitName('centimetre') }}</th>
                      <th class="text-left">{{ getInputUnitName('inch') }}</th>
                      <th class="text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in tableModel" :key="item.millimetre">
                      <td>{{ item.millimetre }}</td>
                      <td>{{ item.centimetre }}</td>
                      <td>{{ item.inch }}</td>
                      <td>{{ item.comment }}</td>
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
          millimetre: '300',
          centimetre: '30',
          inch: '11.81',
          comment: 'Weihrauch HW 97 K',
        },
        {
          millimetre: '395',
          centimetre: '39.5',
          inch: '15.55',
          comment: 'Air Arms TX200',
        },
      ],
      selectModel: {
        inputUnit: 'millimetre',
      },
      selectItems: [
        { conversionMethod: 'millimetre ➞ inch and centimetre', inputUnit: 'millimetre' },
        { conversionMethod: 'centimetre ➞ inch and millimetre', inputUnit: 'centimetre' },
        { conversionMethod: 'inch ➞ millimetre and centimetre', inputUnit: 'inch' },
      ],
      snackbarModel: false,
      snackbarText: '',
      snackbarTimeout: 1000,
      numberPattern: /^-?\d+\.?\d*$|^\d*\.?\d+$/,
    };
  },

  computed: {
    millimetreModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.centimetre.id) {
            return Number(parseFloat(this.inputModel * 10).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.selectModel.inputUnit === AppConstants.UNITS.inch.id) {
            return Number(parseFloat(this.inputModel * 25.4).toFixed(2).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.inputModel).toFixed(2).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    centimetreModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.millimetre.id) {
            return Number(parseFloat(this.inputModel / 10).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.selectModel.inputUnit === AppConstants.UNITS.inch.id) {
            return Number(parseFloat(this.inputModel * 2.54).toFixed(2).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.inputModel).toFixed(2).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    inchModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.millimetre.id) {
            return Number(parseFloat(this.inputModel / 25.4).toFixed(2).replace(/\.?0+$/, ''));
          }

          if (this.selectModel.inputUnit === AppConstants.UNITS.centimetre.id) {
            return Number(parseFloat(this.inputModel / 2.54).toFixed(2).replace(/\.?0+$/, ''));
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
      if (this.millimetreModel > 0 && this.centimetreModel > 0 && this.inchModel > 0) {
        this.tableModel.push({ millimetre: this.millimetreModel, centimetre: this.centimetreModel, inch: this.inchModel });
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
