<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined table-section">
    <div class="layout-container table-section__container">
      <table v-if="table" class="table-section__table">
        <caption :class="{'sr-only': !showCaption}" class="table-section__caption">
          {{ caption }}
        </caption>
        <thead class="table-section__header">
          <tr class="table-section__row">
            <th v-for="(column, columnIndex) in table.columns" :key="columnIndex" scope="col" class="table-section__column-header">
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody class="table-section__body">
          <tr v-for="(row, rowIndex) in table.data" :key="rowIndex" class="table-section__row">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="table-section__cell">
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
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
      table: {
        type: Object,
        required: true,
      },
      showCaption: {
        type: Boolean || null,
        required: true,
      },
      caption: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style src="./TableSection.scss" lang="scss"></style>
