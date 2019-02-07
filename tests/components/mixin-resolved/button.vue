<template>
  <button
    class="buttonComponent"
    @click.prevent="onClick"
    :style="`background:${color};width:${size}px;`"
  />
</template>

<script>
import { anotherMixin, myMixin } from '@mixins/index'

export default {
  mixins: [anotherMixin, myMixin],
}
</script>