<template>
	<button class="buttonComponent" @click.prevent="onClick">
		<!-- @slot Use this slot default -->
		<slot></slot>
	</button>
</template>

<script lang='ts'>
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch,
} from 'vue-property-decorator'
import anotherMixin from '../../mixins/anotherMixin'
import genericMixin from './genericMixin'
import colorMixin from './colorMixin'

/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
 */
@Component
export default class MyComponent extends Vue {
  @Prop() propA: number

  @Prop({ default: 'default value' })
  propB: string

  @Prop([String, Boolean])
  propC: string | boolean
}
</script>

<style scoped>
.button {
  padding: 0.5em 1.5em;
  color: #666;
  background-color: #fff;
  border: 1px solid blue;
  border-radius: 0.3em;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
</style>
