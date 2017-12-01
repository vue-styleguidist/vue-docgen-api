<template>
	<button class="buttonComponent" @click.prevent="onClick">
		<!-- @slot Use this slot default -->
		<slot></slot>
	</button>
</template>

<script>
import anotherMixin from '../../mixins/anotherMixin';
import model from '../../utils/model.json';
import genericMixin from './genericMixin';
import colorMixin from './colorMixin';
import review from '../../utils/review.json';

/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
*/
export default {
	name: 'buttonComponent',
	mixins: [genericMixin, colorMixin],
	props: {
		/**
		 * The size of the button
		 */
		size: {
			default: 'normal'
		},
		/**
		 * The example props
		 */
		example: {
			default: false
		},
		/**
		 * Model example2
		 * @model
		 */
		example2: {
			type: String,
			default: 'example model'
		},
		/**
		 * The example3 props
		 */
		example3: {
			type: Number,
			default: 16
		},
		/**
		 * @ignore
		 * Add custom click actions.
		 **/
		onCustomClick: {
			default: () => () => null,
		},
		/**
		 *@ignore
		 *
		 */
		prop1: String
	},
	data() {
		return {
			count: 0
		}
	},
	methods: {
		onClick() {
			console.log('Hello World');
			setTimeout(() => {
				/**
				 * Success event.
				 *
				 * @event success
				 * @type {object}
				 */
				this.$emit('success', {
					demo: 'example',
				})
			}, 1000);
		}
	}
}
</script>

<style scoped>
.button {
	padding: .5em 1.5em;
	color: #666;
	background-color: #fff;
	border: 1px solid blue;
	border-radius: .3em;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
}
</style>
