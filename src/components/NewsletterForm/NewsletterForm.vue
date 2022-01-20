<template>
  <form
    ref="newsletterForm"
    class="newsletter-form"
    action="https://deltares.us20.list-manage.com/subscribe/post?u=deb635f708fd27f0bdbd6b656&amp;id=c838c5e2dd"
    name="mc-embedded-subscribe-form"
    method="post"
    target="_blank"
    rel="noopener noreferrer"
    @input="checkFormValidity"
  >
    <div class="newsletter-form__input">
      <label class="sr-only" for="mce-EMAIL">Email address</label>
      <input
        id="mce-EMAIL"
        type="email"
        class="newsletter-form__input-field"
        name="EMAIL"
        placeholder="email@email.com"
        required
      >
    </div>

    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups -->
    <div style="position: absolute; left: -5000px;" aria-hidden="true">
      <input type="text" name="b_deb635f708fd27f0bdbd6b656_c838c5e2dd" tabindex="-1" value="">
    </div>

    <v-btn type="submit" color="primary" :disabled="!formIsValid">
      Send
    </v-btn>
  </form>
</template>

<script>
  export default {
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
