<template>
  <div class="page">

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '<%= name.pascalCase %>',
  components: {

  },
  setup() {

    return {}
  },
});
</script>
<% if (scoped) { %>
<style scoped>
<% } else { %>
<style>
<% } %>
</style>
