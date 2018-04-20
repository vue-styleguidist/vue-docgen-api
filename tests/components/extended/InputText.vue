<template>
  <!--How to include the question here???-->
  <input :placeholder="placeholder">
</template>
<script>
import Base from './Base.vue'

/**
 * Description InputText
 */
export default {
  name: 'InputText',
  extends: Base,
  props: ['placeholder'],
}
</script>
