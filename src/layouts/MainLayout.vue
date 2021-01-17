<template>
  <q-layout view="hHh Lpr fFf">

    <q-header reveal elevated class="bg-primary" height-hint="98">
      <q-toolbar style="justify-content: space-between;">
        <q-btn :style="'visibility: ' + (isAuthenticated ? 'visible' : 'hidden')" dense flat round icon="menu" @click="drawer = !drawer" />
        <div style="display: flex; align-items: center;">
          <div v-if="isAuthenticated" style="margin-right: 1rem;">{{accountInfo.account_name}}</div>
<!--          <WalletLoginDialog v-on:onSigninFinish="onSigninFinish"></WalletLoginDialog>-->
          <q-btn v-if="!isAuthenticated" style="justify-self: flex-end;" @click="() => connect('scatter')">Login</q-btn>
          <q-btn v-if="isAuthenticated" style="justify-self: flex-end;" @click="() => logout()">Logout</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :width="200"
      :breakpoint="800"
      bordered
      content-class="bg-grey-0"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList">
            <q-item :key="index" clickable :active="selectedItemLabel === menuItem.label" active-class="bg-grey-4" v-ripple @click="onSelectMenu(menuItem)">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="text-center q-ma-md row">
        <div class="col-md-5"></div>
        <div class="col-xs-12 col-md-2 q-mb-md">
          <img width="110" src="~assets/freeos_icon.png">
        </div>
        <div v-if="isAuthenticated&&claimInfo" class="col-xs-12 col-md-5 row text-left">
          <div class="col-xs-3"></div>
          <div class="col-xs-8">
            <div class="row">
              <div class="col-5">Liquid: </div>
              <div class="col-5 text-primary text-weight-bold">{{(claimInfo.eosInAccount&&claimInfo.eosInAccount.balance) || '0.0000 EOS'}}</div>
            </div>
            <q-separator class="q-mt-sm q-mb-sm" />
            <div class="row">
              <div class="col-5">Staked: </div>
              <div class="col-5 text-primary text-weight-bold">{{(claimInfo.eosStaked&&claimInfo.eosStaked.stake) || '0.0000 EOS'}}</div>
            </div>
            <q-separator class="q-mt-sm q-mb-sm" />
            <div class="row text-green text-weight-bold">
              <div class="col-5">Total FREEOS: </div>
              <div class="col-5">{{(claimInfo.freeosInAccount&&claimInfo.freeosInAccount.balance) || '0.0000 FREEOS'}}</div>
            </div>
          </div>
        </div>
      </div>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-dark text-white" >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar >
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
// import WalletLoginDialog from 'components/account-management/WalletLoginDialog'
import { mapActions, mapGetters } from 'vuex'

const menuList = [
  {
    icon: 'monetization_on',
    label: 'Claim',
    separator: true,
    route: '/claim'
  },
  {
    icon: 'swap_horiz',
    label: 'Transfer',
    separator: true,
    route: '/transfer'
  },
  {
    icon: 'get_app',
    label: 'Stake',
    separator: true,
    route: '/stake'
  }
]
export default {
  components: {
  },
  data () {
    return {
      isShowDrawerButton: false,
      drawer: false,
      selectedItemLabel: null,
      menuList
    }
  },
  computed: {
    ...mapGetters('account', ['isAuthenticated', 'connecting', 'accountInfo', 'claimInfo'])
  },
  methods: {
    onSigninFinish (event) {
      if (event.isFinished) {
        this.isShowDrawerButton = true
        this.drawer = true
        this.onSelectMenu(menuList[0])
      }
    },
    onSelectMenu (menuItem) {
      (this.$route.path !== menuItem.route) && this.$router.push(menuItem.route)
      this.selectedItemLabel = menuItem.label
    },
    ...mapActions('account', ['connect', 'logout', 'getClaimInfo'])
  },
  watch: {
    isAuthenticated: {
      immediate: true,
      handler: function (val) {
        console.log(this.claimInfo)
        console.log(val)
        if (val && this.accountInfo) {
          this.getClaimInfo(this.accountInfo.account_name)
        }
        if (val && this.$route.query.returnUrl) {
          this.$router.push({ path: this.$route.query.returnUrl })
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
