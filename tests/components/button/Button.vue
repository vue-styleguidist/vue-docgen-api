<template>
<button class="buttonComponent" @click.prevent="onClick">
	<slot></slot>
</button>
</template>

<script>
import genericMixin from './genericMixin';
import colorMixin from './colorMixin';

export default {
	name: 'buttonComponent',
	mixins: [genericMixin, colorMixin],
	props: {
		/**
		 * The size of the button
		 * `small, normal, large`
		 */
		size: {
			default: 'normal'
		},
		/**
		 * Add custom click actions.
		 **/
		onCustomClick: {
			default: () => () => null,
		},
	},
	data () {
		return {
			count : 0
		}
	},
	methods: {
		onClick(){
			console.log('Hello World')
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
