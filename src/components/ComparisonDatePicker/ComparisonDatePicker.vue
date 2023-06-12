<template>
  <div>
    <v-menu
      v-model="datePickerMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      origin="overlap"
      offset-y
      max-width="290px"
      min-width="auto"
      right
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="formattedDate"
          label="Select date"
          readonly
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="isoDate"
        :allowed-dates="allowedDates"
        no-title
        scrollable
        @change="datePickerMenu = false"
      />
    </v-menu>
  </div>
</template>

<script>
  import { formatDate, isoFormatDate } from '@/lib/primitive-helpers'

  export default {
    props: {
      availableDates: {
        type: Array,
        default: () => [],
      },

      date: {
        type: Date,
        default: () => new Date(),
      },
    },

    data () {
      return {
        isoDate: isoFormatDate(new Date()),
        datePickerMenu: false,
      }
    },

    computed: {
      isoAvailableDates () {
        return this.availableDates.map(date => isoFormatDate(date))
      },
      // Date displayed to the user in the text field
      // Format: DD/MM/YYYY
      formattedDate () {
        return formatDate(this.isoDate)
      },
    },

    watch: {
      isoDate (newVal) {
        this.$emit('dateChanged', new Date(newVal))
      },
    },

    mounted () {
      // v-date-picker accepts ISO 8601 date strings (YYYY-MM-DD)
      // https://v2.vuetifyjs.com/en/components/date-pickers/#caveats
      this.isoDate = isoFormatDate(this.date)
    },

    methods: {
      allowedDates (date) {
        return this.isoAvailableDates.includes(date)
      },
    },
  }
</script>
