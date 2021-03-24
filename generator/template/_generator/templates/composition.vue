<template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '<%%= name.pascalCase %%>',
  props: [],
  setup() {
    return {}
  }
})
</script>
<%% if (scoped) { %%>
<style scoped>
<%% } else { %%>
<style>
<%% } %%>
</style>
