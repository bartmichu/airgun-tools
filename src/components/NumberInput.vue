<template>
  <v-text-field :readonly="isReadOnly" :variant="fieldVariant" density="compact" :bg-color="backgroundColor"
    type="number" min=0 :step="inputStep" placeholder="enter value" :suffix="unitSymbol" @focus="toggleFocus(true)"
    @blur="toggleFocus(false)" @click.stop="emitClickEvent($event)" @keyup.enter="emitEnterEvent"
    @input="$emit('update:modelValue', $event.target.value)">
  </v-text-field>
</template>

<script>
import AppConstants from '@/components/AppConstants';

export default {

  props: ['unit', 'isReadOnly'],

  data() {
    return {
      isFocused: false,
    };
  },

  computed: {
    backgroundColor: {
      get() {
        if (this.isReadOnly === true) {
          return 'green-lighten-4';
        }
        return this.isFocused ? 'yellow' : 'yellow-lighten-3';
      },
    },
    fieldVariant: {
      get() {
        return this.isReadOnly ? 'filled' : 'solo';
      },
    },
    unitSymbol: {
      get() {
        return AppConstants.UNITS?.[this.unit]?.symbol ?? '';
      },
    },
    inputStep: {
      get() {
        return AppConstants.UNITS?.[this.unit]?.step ?? 1;
      },
    },
  },

  methods: {
    toggleFocus(state) {
      this.isFocused = state ?? !this.isFocused;
    },
    emitClickEvent(event) {
      if (this.isReadOnly) {
        this.$emit('clickReadOnly', event);
      }
    },
    emitEnterEvent() {
      if (!this.isReadOnly) {
        this.$emit('confirmInput');
      }
    },
  },
};
</script>
