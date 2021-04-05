<template>
  <q-layout view="hHh Lpr fFf">

    <q-header reveal elevated class="bg-primary" height-hint="98">
      <q-toolbar style="justify-content: space-between;">
        <q-btn :style="'visibility: ' + (isAuthenticated ? 'visible' : 'hidden')" dense flat round icon="menu" @click="drawer = !drawer" />
        <div style="display: flex; align-items: center;">
          <div v-if="isAuthenticated" style="margin-right: 1rem;">{{accountName}}</div>
          <q-btn color="primary" label="Login" v-if="!isAuthenticated" @click="() => connectWallet('anchor')">
          </q-btn>
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
      :style="'visibility: ' + (isAuthenticated ? 'visible' : 'hidden')"
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
        <balance v-if="isAuthenticated" class="col-xs-12 col-md-5 row text-left" />
      </div>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-dark text-white" >
      <q-toolbar>
        <!-- Begin Mailchimp Signup Form -->
        <link href="//cdn-images.mailchimp.com/embedcode/slim-10_7.css" rel="stylesheet" type="text/css">
        <div id="mc_embed_signup" class="full-width">
          <form action="https://freeos.us1.list-manage.com/subscribe/post?u=f0bd481181736945f0713d31e&amp;id=6b4c9b07fb" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
            <div id="mc_embed_signup_scroll" class="row justify-center">
              <input type="email" value="" name="EMAIL" class="email q-input" id="mce-EMAIL" placeholder="email address" required autocomplete="off"/>
              <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
              <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_f0bd481181736945f0713d31e_6b4c9b07fb" tabindex="-1" value=""></div>
              <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
            </div>
          </form>
        </div>

        <!--End mc_embed_signup-->
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script>
// import WalletLoginDialog from 'components/accountManagement/WalletLoginDialog'
import { mapState, mapActions, mapGetters } from 'vuex'
import Balance from 'components/accountManagement/Balance'
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
  data () {
    return {
      isShowDrawerButton: false,
      drawer: false,
      selectedItemLabel: null,
      menuList
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      iterationNumber: state => state.calendar.currentIteration.iteration_number
    }),
    ...mapGetters('account', ['isAuthenticated', 'connecting'])
  },
  components: {
    Balance
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
    ...mapActions('account', ['checkIfLoggedIn', 'connectWallet', 'logout', 'getAccountInfo', 'getClaimDetailInfo', 'getRespMasterSwitch']),
    ...mapActions('calendar', ['getClaimCalendar'])
  },
  watch: {
    isAuthenticated: {
      immediate: true,
      handler: function (val) {
        if (val && this.accountName) {
          this.getAccountInfo()
          this.getRespMasterSwitch()
          this.getClaimDetailInfo(this.iterationNumber)
        }
        if (val && this.$route.query.returnUrl) {
          this.$router.push({ path: this.$route.query.returnUrl })
        }
      }
    }
  },
  created () {
    this.getClaimCalendar()
    this.checkIfLoggedIn()
  }
}
</script>

<style>
#mc_embed_signup input.button {
  background: var(--q-color-primary) !important;
}
</style>
