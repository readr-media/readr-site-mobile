<template>
  <div
    class="donate-result"
    :style="{
      height: `${sidebarHeight}px`
    }"
  >
    <div
      v-if="isResultSuccess"
      class="donate-result__success success"
    >
      <p>贊助成功！</p>
      <p>謝謝贊助，以下是贊助明細，發票會寄送到電子信箱</p>
      <div class="success__result-table-wrapper result-table-wrapper">
        <table class="result-table-wrapper__table table">
          <tr>
            <td>贊助金額：</td>
            <td>{{ formData.donateAmount }} 元</td>
          </tr>
          <tr>
            <td>贊助時間：</td>
            <td>{{ formData.date }}</td>
          </tr>
          <tr>
            <td>付款方式：</td>
            <td>信用卡</td>
          </tr>
        </table>
      </div>
      <button
        class="success__back-to-form-button button button--white button--small"
        @click="$emit('backToForm')"
      >
        再次贊助
      </button>
      <footer class="success__footer">
        <img
          v-lazy="'/public/2.0/decorations/flower.png'"
        >
      </footer>
    </div>
    <div
      v-else
      class="donate-result__fail fail"
    >
      <p>付款失敗，是否再次嘗試？</p>
      <div class="fail__buttons buttons">
        <button
          class="buttons__button button button--yellow"
          @click="$emit('backToForm')"
        >
          確認
        </button>
        <button
          class="buttons__button button button--white"
          @click="$emit('closeSidebar')"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    isResultSuccess: {
      type: Boolean,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      sidebarHeight: state => {
        const vw = state.Viewport.width
        const vh = state.Viewport.height
        const headerHeight = vw < 768 ? 40 : 50
        const padding = 14
        return vh - headerHeight - padding * 2
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.donate-result
  display flex
  align-items center

.success
  width 100%
  p:nth-child(1)
    text-align center
    font-size 16px
    font-weight 500
  p:nth-child(2)
    margin 22px 0 0 0
    font-size 12px
    line-height 1.25
  &__result-table-wrapper
    margin 30px 0 0 0
  &__back-to-form-button
    position absolute
    bottom 90px
    width 70% !important
  &__footer
    width 100%
    height 80px
    background-color #ddcf21
    position absolute
    bottom 0
    left 0
    img
      height 100px
      position absolute
      bottom 70px
      right 12px

.table
  border-collapse collapse
  font-size 12px
  width 100%
  td
    padding 10px 3px
    &:nth-child(1)
      font-weight 500
  tr + tr
    border-top 1px dashed black

.fail
  width 100%
  display flex
  flex-direction column
  justify-content center
  align-items center
  p
    font-weight 500
  &__buttons
    margin 20px 0 0 0

.buttons
  width 100%
  &__button
    & + &
      margin 20px 0 0 0

.button
  width 100%
  height 50px
  border-radius 8px
  background-color gray
  font-size 16px
  font-weight 500
  display flex
  justify-content center
  align-items center
  border 1px solid black
  &--yellow
    background-color #ddcf21
  &--white
    background-color white
  &--small
    font-weight 400
    height 30px
</style>
