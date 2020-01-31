<template>
  <section class="team-members">
    <h1>團員組成</h1>
    <ul class="team-members__members-list members-list">
      <li
        v-for="teamMember in teamMembers"
        :key="teamMember.name"
      >
        <TeamMembersPortrait
          :name="teamMember.name"
          :title="teamMember.title"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import TeamMembersPortrait from './TeamMembersPortrait.vue'

export default {
  components: {
    TeamMembersPortrait
  },
  data () {
    return {
      teamMembers: [
        { name: 'hc', title: '總編' },
        { name: 'zoe', title: '記者' }, { name: 'WeiWei', title: '記者' }, { name: 'chaoyen', title: '社群編輯' },
        { name: 'weiweihsu', title: '設計' }, { name: 'yichian', title: '設計' }, { name: 'Tin', title: '產品經理' },
        { name: 'noahtan', title: '前端工程師' }, { name: 'kwhsiung', title: '前端工程師' },
        { name: 'ich', title: '後端工程師' }, { name: 'Yen', title: '後端工程師' }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.team-members
  h1
    text-align left
    padding 0 0 0 10px
  &__members-list
    margin 20px 0 0 0 !important

.members-list
  list-style none
  margin 0
  padding 0
  display flex
  flex-wrap wrap
  justify-content space-around
  background linear-gradient(to top, #69CAD3 50px, transparent 0%)
  li
    display flex
    justify-content center
    background linear-gradient(to top, #69CAD3 50px, transparent 0%)
    &:nth-child(1)
      width 100%
    &:nth-child(n+2):nth-child(-n+7)
      width 33.33%
    &:nth-child(n+8):nth-child(-n+11)
      width 50%

@media (min-width 768px)
  .team-members
    h1
      text-align center
      padding 0

  .members-list
    flex-wrap nowrap
    justify-content space-around
    li
      width auto !important
</style>
