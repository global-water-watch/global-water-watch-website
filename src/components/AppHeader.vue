<template>
  <header>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </li>
        <li
          v-for="item in menuItems"
          :key="item.id"
        >
          <NuxtLink :to="`/${ item.page.slug }`">
            {{ item.page.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  data () {
    return {
      menuItems: [],
    }
  },
  fetch () {
    console.log('using mock items')
    this.menuItems = [
      { id: 1, page: { title: 'Test Page', slug: 'test-page' } },
    ]
  },
}
</script>
