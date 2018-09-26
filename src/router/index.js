import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloWeb3 from '@/components/HelloWeb3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/web3',
      name: 'HelloWeb3',
      component: HelloWeb3
    }
  ]
})
