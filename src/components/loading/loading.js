import { current as theme } from '../../theme'
import { Vue } from '../../install'
import Events from '../../events'
import Loading from './loading.vue'

let
  vm,
  appIsInProgress = false,
  timeout,
  props = {}

function isActive () {
  return appIsInProgress
}

function show ({
  delay = 500,
  spinner = theme === 'ios' ? 'ios' : 'tail',
  message = false
} = {}) {
  props.spinner = spinner
  props.message = message

  if (appIsInProgress) {
    vm && vm.$forceUpdate()
    return
  }

  timeout = setTimeout(() => {
    timeout = null

    const node = document.createElement('div')
    document.body.appendChild(node)
    document.body.classList.add('with-loading', 'dimmed')

    vm = new Vue({
      el: node,
      render: h => h(Loading, {props})
    })
  }, delay)

  appIsInProgress = true
  Events.trigger('app:loading', true)
}

function hide () {
  if (!appIsInProgress) {
    return
  }

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  else {
    vm.$destroy()
    document.body.classList.remove('with-loading', 'dimmed')
    document.body.removeChild(vm.$el)
    vm = null
  }

  appIsInProgress = false
  Events.trigger('app:loading', false)
}

export default {
  isActive,
  show,
  hide
}
