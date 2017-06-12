<template>
<button class="button" @click.prevent="onClick">
	<slot></slot>
</button>
</template>

<script>

export default {
	name: 'button',
	props: {
		/**
		 * The color for the button
		 */
		color: {
			type: String,
			default: '#333'
		},
		/**
		 * The size of the button
		 * `small, normal, large`
		 */
		size: {
			type: Number,
			default: 'normal'
		},
	},
	data () {
		return {
			count : 0
		}
	},
	methods: {
		onClick(){
			console.log('Hola Mundo')
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
