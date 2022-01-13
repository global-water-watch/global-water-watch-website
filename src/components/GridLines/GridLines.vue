<template>
  <div class="layout-section grid-lines">
    <div class="layout-container grid-lines__inner" />
  </div>
</template>

<style lang="scss">
  .grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    z-index: $layer-grid-lines;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .grid-lines__inner {
    height: 100%;
    background-image:
      linear-gradient($color-white-alpha, $color-white-alpha),
      linear-gradient($color-white-alpha, $color-white-alpha),
      linear-gradient($color-white-alpha, $color-white-alpha);
    background-repeat: no-repeat;
    background-size: 1px 100%;
    background-position: 0 0, center 0, right 0;
  }
</style>
