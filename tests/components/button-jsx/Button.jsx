import Vue from 'vue'

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
    size: {
      default: 'normal',
    },
  },
  data() {
    return {
      count: 0,
    }
  },
  render() {
    const { sortKey, capitalize } = this
    return <button>Click Me</button>
  },
  methods: {
    onClick() {
      console.log('Hello World')
      setTimeout(() => {
        /**
         * Success event.
         *
         * @event success
         * @property {object} demo - example
         * @property {number} called - test called
         * @property {boolean} isPacked - Indicates whether the snowball is tightly packed.
         */
        this.$emit(
          'success',
          {
            demo: 'example',
          },
          10,
          false,
        )
      }, 1000)
    },
  },
}
