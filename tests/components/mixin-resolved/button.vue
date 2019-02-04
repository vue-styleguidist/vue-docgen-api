<template>
  <button
    class="buttonComponent"
    @click.prevent="onClick"
    :style="`background:${color};width:${size}px;`"
  />
</template>

<script>
import { anotherMixin } from '@mixins/index'
import myMixin from '@mixins/another/mix'

export default {
  mixins: [anotherMixin, myMixin],
}
</script>