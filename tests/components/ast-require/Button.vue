<template>
  <button>{{value}}</button>
</template>

<script>
/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
 */
export default {
  name: 'buttonComponent',
  props: {
    /**
     * The size of the button
     */
    value: {
      type: String,
      default: 'normal',
    },
  },
}
export const BUTTON_NAME = 'Interior Button Name'
</script>
