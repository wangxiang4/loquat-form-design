import hasPerm from './hasPerm'
import { KEY_COMPONENT_NAME } from '@/global/variable'
const install = function (Vue) {
  Vue.directive(KEY_COMPONENT_NAME.concat('has-perm'), hasPerm)
}

export default install
