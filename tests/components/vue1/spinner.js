/**
 * Partial mapping, object spread operator example
 */
const TEMPLATE = require('./bpi-spinner.html');

Vue.component('spinner', {
	template: TEMPLATE,
	props: {
		loading: {
			default: false
		}
	},
	methods: {
		/**
		 * Sets the order
		 *
		 * @public
		 * @version 1.0.5
		 * @since Version 1.0.1
		 * @param {string} key Key to order
		 * @returns {string} Test
		 */
		async onSubmit () {
			let  res = await api.post(this.params)
			this.response = response
		}
	}
})
