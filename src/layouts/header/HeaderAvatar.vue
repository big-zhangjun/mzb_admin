<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="getImg()" />
      <span class="name">{{ user.userName }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="goUserCenter">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '@/services/user'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      logout()
      localStorage.clear()
      this.$router.push('/login')
    },
    goUserCenter() {
      this.$router.push('/userCenter')
    },
    getImg() {
      if (this.user.avatar) {
        return process.env.VUE_APP_API_BASE_URL + this.user.avatar.replace(/^\./, '')
      }
    },
  }
}
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;

  .avatar,
  .name {
    align-self: center;
  }

  .avatar {
    margin-right: 8px;
  }

  .name {
    font-weight: 500;
  }
}

.avatar-menu {
  width: 150px;
}
</style>
