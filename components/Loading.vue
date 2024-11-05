<script>
export default {
  data () {
    return {
      progress: 0
    }
  },
  mounted () {
    setInterval(() => {
      if (this.progress < 100) {
        clearInterval()
      } else {
        this.progress = 0
      }
    })
  }
}
</script>
<template>
  <div class=" custom-loading">
    <div class=" custom-loading-bar" style="{width: `${progress}%`}" />
  </div>
</template>
<style>
.custom-loading{
  width: 100%;
  height: 5px;
  background-color: #ddd;
}
.custom-loading-bar{
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s;
}
</style>
