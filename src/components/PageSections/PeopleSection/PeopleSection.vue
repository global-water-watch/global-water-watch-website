<template>
  <section
    :id="id"
    class="layout-section layout-section--lined layout-section--padded people-section"
  >
    <div class="layout-container">
      <h2 class="h2 ">
        {{ title }}
      </h2>
      <ul class="people-section__list">
        <li v-for="person in persons" :key="person.id">
          <Person
            :image="person.image"
            :name="person.name"
            :role="person.role"
            :organisation="person.organisation"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      persons: {
        type: Array,
        required: true,
      },
    },
  }
</script>

<style src="./PeopleSection.scss" lang="scss"></style>
