<template>
  <div class="server-error" />
</template>
<script>
export default {
  name: 'ServerError',
  mounted () {},
  methods: {}
}
</script>
<style lang="stylus" scoped>
  .server-error
    height 100vh
    width 100vw
    background-image url('/public/500.jpg')
    background-position center center
    background-size cover
    background-repeat no-repeat
</style>
