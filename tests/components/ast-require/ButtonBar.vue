<template>
  <div>
    <Button v-for="name in listofButtonNames" :name="name"/>
  </div>
</template>
<script>
import Button from './Button'

const nonExported = {
  name: 'notdisplayed',
}

export default {
  name: 'buttonBar',
  components: { Button },
  props: {
    listofButtonNames: {
      type: Array,
      default: () => [BUTTON_NAME],
    },
  },
}
</script>
