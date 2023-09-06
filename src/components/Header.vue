<script setup>

</script>

<template>
<header>
    <slot></slot>
</header>
</template>

<style scoped>
header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  background-color: var(--header-background);
  padding: var(--padding);
  width: 100%;
  box-shadow: var(--box-shadow);
}
</style>
