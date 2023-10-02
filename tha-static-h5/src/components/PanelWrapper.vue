<template>
  <div class="panel">
    <div class="panel-title">
      <slot name="title" />
    </div>

    <div class="panel-body"><slot /></div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
}

.panel-title {
  background-color: $secondary;
  color: $header-color;
  font-weight: 500;
  text-align: center;
  padding: 1em 1.5em;
  border-radius: 0.75em 0.75em 0 0;
}

.panel-body {
  background-color: $panel-bg-color;
  padding: 1rem 1.5rem;
}
</style>
