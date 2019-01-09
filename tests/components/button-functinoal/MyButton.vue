<template functional>
  <button :style="`width: ${props.size}px;`" class="buttonComponent">
    <!-- @slot Use this slot default -->
    <slot/>
  </button>
</template>
