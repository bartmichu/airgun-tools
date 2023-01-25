<template>

  <v-card class="mx-auto mt-16" variant="outlined">
    <v-layout>

      <!-- start bar -->
      <v-app-bar color="black" density="compact" elevation="0">

        <template v-slot:prepend>
          <v-icon icon="mdi-weight"></v-icon>
        </template>

        <v-app-bar-title>Pellet weight</v-app-bar-title>
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
                    <p class="text-h6">Weight units converter</p>
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

                <!-- start gram output -->
                <v-row v-show="selectModel.inputUnit !== 'gram'">
                  <v-col cols="4">
                    <p>{{ getInputUnitName('gram') }}:</p>
                  </v-col>

                  <v-col cols="8">
                    <NumberInput :unit="'gram'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="gramModel" />
                  </v-col>
                </v-row>
                <!-- end gram output -->

                <!-- start grain output -->
                <v-row v-show="selectModel.inputUnit !== 'grain'">
                  <v-col cols="4">
                    <p>{{ getInputUnitName('grain') }}:</p>
                  </v-col>

                  <v-col cols="8">
                    <NumberInput :unit="'grain'" :isReadOnly="true" @clickReadOnly="copyToClipboard($event)"
                      v-model="grainModel" />
                  </v-col>
                </v-row>
                <!-- end grain output -->

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
            <v-col cols="12" sm="1" md="1" lg="2" class="d-sm-none d-md-flex">
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
                      <th class="text-left">{{ getInputUnitName('gram') }}</th>
                      <th class="text-left">{{ getInputUnitName('grain') }}</th>
                      <th class="text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in tableModel" :key="item.gram">
                      <td>{{ item.gram }}</td>
                      <td>{{ item.grain }}</td>
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
          gram: '0.36',
          grain: '5.56',
          comment: 'H&N Field Target Trophy Green .177',
        },
        {
          gram: '0.547',
          grain: '8.44',
          comment: 'JSB Exact .177',
        },
        {
          gram: '0.56',
          grain: '8.64',
          comment: 'H&N Field Target Trophy .177',
        },
        {
          gram: '0.69',
          grain: '10.65',
          comment: 'H&N Baracuda .177',
        },
        {
          gram: '1.03',
          grain: '15.90',
          comment: 'JSB Exact Jumbo .22',
        },
        {
          gram: '1.37',
          grain: '21.14',
          comment: 'H&N Baracuda .22',
        },
      ],
      selectModel: {
        inputUnit: 'gram',
      },
      selectItems: [
        { conversionMethod: 'gram ➞ grain', inputUnit: 'gram' },
        { conversionMethod: 'grain ➞ gram', inputUnit: 'grain' },
      ],
      snackbarModel: false,
      snackbarText: '',
      snackbarTimeout: 1000,
      numberPattern: /^-?\d+\.?\d*$|^\d*\.?\d+$/,
    };
  },

  computed: {

    gramModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.grain.id) {
            return Number(parseFloat(this.inputModel / 15.432).toFixed(3).replace(/\.?0+$/, ''));
          }

          return Number(parseFloat(this.inputModel).toFixed(3).replace(/\.?0+$/, ''));
        }

        return 0;
      },
    },
    grainModel: {
      get() {
        if (this.numberPattern.test(this.inputModel) && Number(this.inputModel) > 0) {
          if (this.selectModel.inputUnit === AppConstants.UNITS.gram.id) {
            return Number(parseFloat(this.inputModel * 15.432).toFixed(2).replace(/\.?0+$/, ''));
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
      if (this.gramModel > 0 && this.grainModel > 0) {
        this.tableModel.push({ gram: this.gramModel, grain: this.grainModel });
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
