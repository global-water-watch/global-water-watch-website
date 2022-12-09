<template>
  <v-expansion-panels class="feedback-form">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <h2>Give Feedback</h2>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <form
          ref="feedbackForm"
          class="feedback-form__form"
          method="post"
          target="_blank"
          rel="noopener noreferrer"
          @input="checkFormValidity"
          @submit.prevent="submitForm"
        >
          <div class="feedback-form__section">
            <input v-model="form.reservoirId" type="hidden" name="reservoirId">

            <div class="feedback-form__field">
              <v-alert v-if="successMessage" type="success">
                {{ successMessage }}
              </v-alert>

              <v-alert v-if="errorMessage" type="error">
                {{ errorMessage }}
              </v-alert>
            </div>

            <div class="feedback-form__field">
              <label for="reservoirNameSuggestion">Reservoir name suggestion?</label>
              <input
                id="reservoirNameSuggestion"
                v-model="form.reservoirNameSuggestion"
                class="feedback-form__input-field"
                name="reservoirNameSuggestion"
                :placeholder="reservoir.name || 'Reservoir name'"
                autocomplete="off"
              >
            </div>

            <div class="feedback-form__field">
              <label for="notes">Notes</label>
              <textarea
                id="notes"
                v-model="form.notes"
                class="feedback-form__textarea-field"
                name="notes"
                placeholder="Any additional notes about this reservoir"
                autocomplete="off"
                rows="5"
              />
            </div>

            <v-btn
              type="submit"
              color="primary"
              :disabled="!formIsValid"
            >
              Send
            </v-btn>
          </div>
        </form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  export default {
    props: {
      reservoir: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        formIsValid: false,
        successMessage: '',
        errorMessage: '',
        form: {
          reservoirId: this.reservoir.id,
          reservoirNameSuggestion: '',
          notes: '',
        },
      }
    },
    methods: {
      checkFormValidity () {
        this.formIsValid = this.$refs.feedbackForm?.checkValidity() || false
      },

      async submitForm () {
        try {
          const response = await this.$axios({
            method: 'post',
            baseURL: '',
            url: '/.netlify/functions/feedback-form',
            data: {
              ...this.form,
            },
          })

          this.successMessage = ''
          this.errorMessage = ''

          if (response.status === 200) {
            this.successMessage = 'Thank you for your feedback, we\'ll work on it!'
            this.form.reservoirNameSuggestion = ''
            this.form.notes = ''
          } else {
            this.errorMessage = 'Something went wrong. Please try again.'
          }
        } catch (e) {
          console.error(e)
        }
      },
    },
  }
</script>

<style src="./FeedbackForm.scss" lang="sss"></style>
