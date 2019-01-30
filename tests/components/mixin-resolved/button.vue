<template>
  <button
    class="buttonComponent"
    @click.prevent="onClick"
    :style="`background:${color};width:${size}px;`"
  />
</template>

<script>
import { anotherMixin } from '@mixins/index'

export default {
  mixins: [anotherMixin],
}
</script>