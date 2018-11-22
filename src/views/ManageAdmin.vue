<template>
  <div class="backstage admin">
    <template v-if="showMain">
      <TheControlBar
        @addAccount="addMember"
        @addNews="showEditorHandler({ postPanel: 'add', postType: setting.POST_TYPE.NEWS })"
        @addReview="showEditorHandler({ postPanel: 'add', postType: setting.POST_TYPE.REVIEW })"
        @addVideo="showEditorHandler({ postPanel: 'add', postType: setting.POST_TYPE.VIDEO })"
        @closeControlBar="closeControlBar"
        @editNews="showDraftListHandler(setting.POST_TYPE.NEWS)"
        @editProfile="showProfileHandler"
        @editReview="showDraftListHandler(setting.POST_TYPE.REVIEW)"
        @openPanel="openPanel"
        :showControlBar="showControlBar"
      />
      <main class="backstage-container">
        <template v-if="activePanel === 'accounts'">
          <MembersPanel v-if="$can('memberManage')" @filterChanged="filterChanged"></MembersPanel>
        </template>
        <template v-else-if="activePanel === 'records'">
          <section class="backstage__records">
            <app-tab class="backstage__tab" :tabs="tabs" @changeTab="tabHandler" :defaultTab="defaultTab">
              <PostListInTab
                slot="0"
                :posts="posts"
                @deletePost="showAlertHandler"
                @editPost="showEditorHandler"
                @filterChanged="filterChanged">
              </PostListInTab>
              <PostListInTab
                slot="1"
                :posts="posts"
                @deletePost="showAlertHandler"
                @editPost="showEditorHandler"
                @filterChanged="filterChanged">
              </PostListInTab>
              <FollowingListInTab slot="2"></FollowingListInTab>
              <PointManager slot="3" v-if="isDonationActive"></PointManager>
            </app-tab>
          </section>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="backstage__panel">
            <PostList
              :maxResult="20"
              :posts="posts"
              :sort="currSort"
              @deletePosts="showAlertHandler"
              @editPost="showEditorHandler"
              @filterChanged="filterChanged"
              @publishPosts="showAlertHandler">
            </PostList>
          </section>
        </template>
        <template v-else-if="activePanel === 'tags'">
          <section class="backstage__panel">
            <TagList
              :maxResult="20"
              :sort="currSort"
              :tags="tags"
              @addTag="addTag"
              @deleteTags="showAlertHandler"
              @filterChanged="filterChanged"
              @updateTagList="updateTagList({})">
            </TagList>
          </section>
        </template>
      </main>
      <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showLightBox" :isConversation="true">
        <MemberAccountEditor
          action="add"
          :shouldShow="showLightBox"
          :title="$t('admin.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER')"
          @updated="filterChanged">
        </MemberAccountEditor>
      </BaseLightBox>
      <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showProfile">
        <ProfileEdit :profile="profile" :showLightBox="showProfile" @save="showProfile = false"/>
      </BaseLightBox>
      <BaseLightBox :showLightBox.sync="showDraftList">
        <PostListDetailed
          :posts="postsDraft"
          @deletePost="showAlertHandler"
          @editPost="showEditorHandler">
        </PostListDetailed>
      </BaseLightBox>
      <BaseLightBox class="text-editor" :showLightBox.sync="showEditor">
        <PostPanel
          :action="postPanel"
          :editorType="postType"
          :initialPost="post"
          @closeEditor="showEditor = false"
          @updateList="updatePostList">
        </PostPanel>
      </BaseLightBox>
      <BaseLightBox :isAlert="true" :showLightBox.sync="showAlert">
        <AlertPanel
          :status="itemsStatus"
          :statusChanged="postStatusChanged"
          :items="itemsSelected"
          :needConfirm="needConfirm"
          :showLightBox="showAlert"
          :type="alertType"
          @deletePosts="deletePosts"
          @deleteTags="deleteTags"
          @closeAlert="alertHandler(false)"
          @publishPosts="publishPostHandler">
        </AlertPanel>
      </BaseLightBox>
    </template>
  </div>
</template>
<script>
  import { POST_PUBLISH_STATUS, POST_TYPE, TAG_ACTIVE, } from '../../api/config'
  import { filter, find, forEach, get, includes, unionBy, } from 'lodash'
  import AlertPanel from '../components/AlertPanel.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import MemberAccountEditor from '../components/admin/MemberAccountEditor.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'
  import PointManager from 'src/components/point/PointManager.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostListInTab from '../components/PostListInTab.vue'
  import PostPanel from '../components/PostPanel.vue'
  import ProfileEdit from '../components/member/ProfileEdit.vue'
  import Tab from '../components/Tab.vue'
  import TagList from '../components/TagList.vue'
  import TheControlBar from '../components/TheControlBar.vue'
  import VideoList from '../components/VideoList.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const addTags = (store, text = '') => {
    return store.dispatch('ADD_TAGS', {
      params: {
        text: text,
        updated_by: get(store, [ 'state', 'profile', 'id', ]),
      },
    })
  }

  const deletePosts = (store, { params, }) => {
    return store.dispatch('DELETE_POSTS', {
      params: params,
    })
  }

  const deleteTags = (store, ids = []) => {
    return store.dispatch('DELETE_TAGS', {
      params: {
        ids: ids,
        updated_by: get(store, [ 'state', 'profile', 'id', ]),
      },
    })
  }

  const getPosts = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {},
  } = {}) => {
    return store.dispatch('GET_POSTS', {
      params: {
        max_result: maxResult,
        page: page,
        show_author: true,
        show_updater: true,
        sort: sort,
        where: where,
      },
    })
  }

  const getPostsByUser = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {},
  }) => {
    return store.dispatch('GET_POSTS_BY_USER', {
      params: {
        max_result: maxResult,
        page: page,
        show_author: true,
        show_updater: true,
        sort: sort,
        where: where,
      },
    })
  }

  const getPostsCount = (store, params = {}) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: params,
    })
  }

  const getTags = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    keyword = '',
    stats = false,
  } = {}) => {
    return store.dispatch('GET_TAGS', {
      params: {
        max_result: max_result,
        page: page,
        sort: sort,
        keyword: keyword,
        stats: stats,
      },
    })
  }

  const getTagsCount = (store, {
    keyword = '',
  } = {}) => {
    return store.dispatch('GET_TAGS_COUNT', {
      params: {
        keyword: keyword,
      },
    })
  }

  const getMembers = (store, { page, sort, }) => {
    return store.dispatch('GET_MEMBERS', {
      params: {
        max_result: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT,
      },
    })
  }

  const getMembersCount = (store, params = {}) => { 
    return store.dispatch('GET_MEMBERS_COUNT', { 
      params, 
    }) 
  } 

  const publishPosts = (store, params) => {
    return store.dispatch('PUBLISH_POSTS', { params, })
  }

  export default {
    name: 'ManageAdmin',
    components: {
      'app-tab': Tab,
      AlertPanel,
      BaseLightBox,
      ProfileEdit,
      FollowingListInTab,
      MemberAccountEditor,
      MembersPanel,
      PointManager,
      PostList,
      PostListDetailed,
      PostListInTab,
      PostPanel,
      TagList,
      TheControlBar,
      VideoList,
    },
    props: {
      showControlBar: {
        type: Boolean,
      },
    },
    metaInfo () {
      return {
        isTappayNeeded: this.isTappayRequired,
      }
    },     
    data () {
      return {
        activePanel: 'accounts',
        activeTab: 'reviews',
        alertType: 'post',
        currPage: DEFAULT_PAGE,
        currPagePostsDraft: DEFAULT_PAGE,
        currSort: DEFAULT_SORT,
        defaultTab: 0,
        isPublishPostInEditor: false,
        itemsStatus: undefined,
        itemsSelected: [],
        loading: false,
        needConfirm: false,
        post: {},
        postStatusChanged: false,
        postForPublishInEditor: {},
        postPanel: 'add',
        postType: POST_TYPE.REVIEW,
        postsSelected: [],
        setting: this.$store.state.setting,
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        showLightBox: false,
        showMain: false,
        showProfile: false,
      }
    },
    computed: {
      isDonationActive () { 
        return get(this.$store, 'state.setting.DONATION_IS_DEPOSIT_ACTIVE', false) 
      },    
      isTappayRequired () {
        return get(this.$store, 'state.isTappayRequired', false)
      },         
      itemsSelectedID () {
        const items = []
        forEach(this.itemsSelected, (item) => {
          items.push(item.id)
        })
        return items
      },
      posts () {
        return get(this.$store, [ 'state', 'posts', ], [])
      },
      postsDraft () {
        return get(this.$store, [ 'state', 'postsDraft', ], [])
      },
      profile () {
        return get(this.$store, [ 'state', 'profile', ], {})
      },
      tabs () {
        const defaultTabs = [
          this.$t('TAB.REVIEW_RECORD'),
          this.$t('TAB.NEWS_RECORD'),
          this.$t('TAB.FOLLOW_RECORD'),
        ]
        this.isDonationActive && defaultTabs.push(this.$t('TAB.POINTS_RECORD')) 
        return defaultTabs
      },
      tags () {
        return get(this.$store, [ 'state', 'tags', ], [])
      },
    },
    watch: {
      isTappayRequired () {
        this.$forceUpdate()
      },
    },
    beforeMount () {
      this.loading = true
      this.$can('memberManage') && Promise.all([
        getMembers(this.$store, {}),
        getMembersCount(this.$store),
      ])
      .then(() => this.loading = false)
      .catch(() => this.loading = false)

      if (get(this.$route, 'params.panel')) { 
        switch (get(this.$route, 'params.panel')) {
          case 'profile-edit':
            this.showProfile = true
            break
          default:
            this.activePanel = get(this.$route, 'params.panel')
        }
        switch (get(this.$route, 'params.tool')) {
          case 'following':
            this.defaultTab = 2
            break
          case 'point-manager':
            this.isDonationActive && (this.defaultTab = 3)
            break
        }
      }      
    },
    methods: {
      addMember () {
        this.showLightBox = true
      },
      addTag (tagName) {
        this.itemsStatus = TAG_ACTIVE.ACTIVE
        this.needConfirm = false
        this.loading = true
        addTags(this.$store, tagName)
        .then(() => {
          this.updateTagList({ needUpdateCount: true, })
          this.showAlert = true
          this.loading = false
        })
        .catch(() => {
          this.alertType = 'error'
          this.needConfirm = false
          this.showAlert = true
          this.loading = false
        })
      },
      alertHandler (showAlert) {
        this.showAlert = showAlert
      },
      closeControlBar () {
        this.$emit('closeControlBar')
      },
      deletePosts () {
        deletePosts(this.$store, {
          params: {
            ids: this.itemsSelectedID,
            updated_by: get(this.$store.state, [ 'profile', 'id', ]),
          },
        }).then(() => {
          this.updatePostList({ needUpdateCount: true, })
          this.showEditor = false
          this.showDraftList = false
          this.needConfirm = false
        })
        .catch(() => {
          this.alertType = 'error'
          this.needConfirm = false
          this.showAlert = true
        })
      },
      deleteTags () {
        deleteTags(this.$store, this.itemsSelectedID)
          .then(() => {
            this.updateTagList({ needUpdateCount: true, })
            this.needConfirm = false
          })
          .catch(() => {
            this.alertType = 'error'
            this.needConfirm = false
            this.showAlert = true
          })
      },
      filterChanged (filter = {}) {
        this.currPage = filter.page || this.currPage
        this.currSort = filter.sort || this.currSort
        
        switch (this.activePanel) {
          case 'accounts':
            return Promise.all([
              getMembers(this.$store, { page: this.currPage, sort: this.currSort, }),
              getMembersCount(this.$store),
            ])
          case 'records':
          case 'posts':
          case 'videos':
            return this.updatePostList({ page: this.currPage, sort: this.currSort, })
          case 'tags':
            return this.updateTagList({ page: this.currPage, sort: this.currSort, })
        }
      },
      openPanel (panel) {
        this.loading = true
        this.activePanel = panel
        this.currSort = DEFAULT_SORT
        this.currPage = DEFAULT_PAGE
        switch (this.activePanel) {
          case 'records':
            this.alertType = 'post'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
              getPostsCount(this.$store, {
                where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'posts':
            this.alertType = 'post'
            Promise.all([
              getPosts(this.$store, {
                where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, POST_TYPE.REPORT, POST_TYPE.MEMO, ], },
              }),
              getPostsCount(this.$store, {
                where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, POST_TYPE.REPORT, POST_TYPE.MEMO, ], },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'tags':
            this.alertType = 'tag'
            Promise.all([
              getTags(this.$store, { stats: true, }),
              getTagsCount(this.$store),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'videos':
            this.alertType = 'video'
            Promise.all([
              getPosts(this.$store, {
                where: { type: POST_TYPE.VIDEO, },
              }),
              getPostsCount(this.$store, {
                where: { type: POST_TYPE.VIDEO, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
        }
      },
      publishPostHandler () {
        this.alertType = 'post'
        this.loading = true
        const params = {}
        params.updated_by = get(this.$store.state, [ 'profile', 'id', ])
        params.ids = this.itemsSelectedID
        publishPosts(this.$store, params)
          .then(() => {
            this.updatePostList({ needUpdateCount: true, })
            this.needConfirm = false
            this.loading = false
          })
          .catch(() => {
            this.alertType = 'error'
            this.needConfirm = false
            this.showAlert = true
            this.loading = false
          })
      },
      showAlertHandler (ids, itemsStatus) {
        this.itemsSelected = []
        const unionPosts = unionBy(this.posts, this.postsDraft, 'id')
        switch (this.alertType) {
          case 'post':
            this.postStatusChanged = true
            this.isPublishPostInEditor = false
            this.itemsStatus = itemsStatus
            this.itemsSelected = filter(unionPosts, (o) => {
              return includes(ids, o.id)
            })
            break
          case 'tag':
            this.itemsStatus = TAG_ACTIVE.DEACTIVE
            this.itemsSelected = filter(this.tags, (o) => {
              return includes(ids, o.id)
            })
            break
        }
        this.needConfirm = true
        this.showAlert = true
      },
      showDraftListHandler (type) {
        this.loading = true
        switch (type) {
          case POST_TYPE.REVIEW:
            Promise.all([
              getPostsByUser(this.$store, {
                where: {
                  author: get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.REVIEW,
                },
              }),
              getPostsCount(this.$store, {
                where: {
                  author: get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.REVIEW,
                },
              }),
            ])
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
          case POST_TYPE.NEWS:
            Promise.all([
              getPostsByUser(this.$store, {
                where: {
                  author: get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.NEWS,
                },
              }),
              getPostsCount(this.$store, {
                where: {
                  author: get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.NEWS,
                },
              }),
            ])
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
        }
      },
      showEditorHandler ({ postPanel, id, postType, }) {
        this.itemsSelected = []
        this.alertType = 'post'

        if (this.activePanel === 'videos') {
          this.alertType = 'video'
        }

        if (postPanel === 'add') {
          this.post = {}
          this.postType = postType
        } else {
          this.post = find(this.posts, { 'id': id, }) || find(this.postsDraft, { 'id': id, })
          this.postType = get(this.post, [ 'type', ])
          this.itemsSelected.push(this.post)
        }
        this.postPanel = postPanel
        this.showEditor = true
      },
      showProfileHandler () {
        this.showProfile = true
      },
      tabHandler (tab) {
        this.loading = true
        switch (tab) {
          case 0:
            this.activeTab = 'reviews'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
              getPostsCount(this.$store, {
                where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 1:
            this.activeTab = 'news'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
              }),
              getPostsCount(this.$store, {
                where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 2:
            this.activeTab = 'followings'
            break
        }
      },
      updatePostList ({ sort, page, needUpdateCount = false, } = {}) {
        this.sort = sort || this.sort
        this.page = page || this.page
        switch (this.activePanel) {
          case 'records':
            switch (this.activeTab) {
              case 'reviews':
                if (needUpdateCount) {
                  getPostsCount(this.$store, {
                    where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
                  })
                }
                getPostsByUser(this.$store, {
                  page: this.page,
                  where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
                })
                break
              case 'news':
                if (needUpdateCount) {
                  getPostsCount(this.$store, {
                    where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
                  })
                }
                getPostsByUser(this.$store, {
                  page: this.page,
                  where: { author: get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
                })
                break
            }
            break
          case 'posts':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, POST_TYPE.REPORT, POST_TYPE.MEMO, ], },
              })
            }
            getPosts(this.$store, {
              page: this.page,
              sort: this.sort,
              where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, POST_TYPE.REPORT, POST_TYPE.MEMO, ], },
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'videos':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { type: POST_TYPE.VIDEO, },
              })
            }
            getPosts(this.$store, {
              page: this.page,
              sort: this.sort,
              where: { type: POST_TYPE.VIDEO, },
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
        }
      },
      updateTagList ({ sort, page, keyword = '', needUpdateCount = false, }) {
        this.sort = sort || this.sort
        this.page = page || this.page
        if (needUpdateCount) {
          getTagsCount(this.$store, { keyword: keyword, })
        }
        getTags(this.$store, {
          page: this.page,
          sort: this.sort,
          stats: true,
        })
        .then(() => this.loading = false)
        .catch(() => this.loading = false)
      },
    },
    mounted () {
      this.showMain = true
    },
  }
</script>
<style lang="stylus" scoped>
</style>