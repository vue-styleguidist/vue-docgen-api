<template>
  <!--How to include the question here???-->
  <input :placeholder="placeholder">
</template>
<script>
import Base from './Base.vue'

/**
 * Description InputTextDocumented
 */
export default {
  name: 'InputTextDocumented',
  extends: Base,
  props: {
    placeholder: {
      type: String,
    },
  },
}
</script>
