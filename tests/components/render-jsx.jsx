import Vue from 'vue'

export default Vue.component('Counter', {
  functional: true,

  props: {
    count: 0,
  },

  render: function (h, { props: { count } }) {
    return (
      <p>{count}</p>
    )
  },
})
