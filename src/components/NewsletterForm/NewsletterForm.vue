<template>
  <!--
    Embed form source: https://app.sendinblue.com/forms/subscription/edit/622f1ba1ec63726be740cad2
    Based on the 'Simple HTML' version.
  -->
  <form
    ref="newsletterForm"
    class="newsletter-form"
    :action="actionUrl"
    method="post"
    target="_blank"
    rel="noopener noreferrer"
    @input="checkFormValidity"
  >
    <div class="newsletter-form__section">
      <div class="newsletter-form__input">
        <label class="sr-only" for="EMAIL">Email address</label>
        <input
          id="EMAIL"
          type="email"
          class="newsletter-form__input-field"
          name="EMAIL"
          placeholder="email@email.com"
          autocomplete="off"
          required
        >
      </div>

      <v-btn
        type="submit"
        color="primary"
        :disabled="!formIsValid"
      >
        Send
      </v-btn>
    </div>

    <div class="newsletter-form__opt-in">
      <label for="OPT_IN">
        <input id="OPT_IN" type="checkbox" value="1" name="OPT_IN" required>
        <StructuredText
          class="newsletter-form__opt-in-text small"
          :text="optInText"
          :links="optInText.links"
        />
      </label>
    </div>

    <!-- Honeyppot: real people should not fill this in - do not remove this or risk form bot signups -->
    <div style="position: absolute; left: -5000px;" aria-hidden="true">
      <input type="text" name="email_address_check" tabindex="-1" value="">
    </div>

    <!-- Sendinblue form settings - do not change this -->
    <input type="hidden" name="locale" value="en">
    <input type="hidden" name="html_type" value="simple">
  </form>
</template>

<script>
  export default {
    props: {
      actionUrl: {
        type: String,
        required: true,
      },
      optInText: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        formIsValid: false,
      }
    },
    methods: {
      checkFormValidity () {
        this.formIsValid = this.$refs.newsletterForm?.checkValidity() || false
      },
    },
  }
</script>

<style src="./NewsletterForm.scss" lang="sss"></style>
