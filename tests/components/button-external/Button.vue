<template>
  <button class="buttonComponent" @click.prevent="onClick">
    <!-- @slot Use this slot default -->
    <slot></slot>
  </button>
</template>

<script src='./button.ts'>
