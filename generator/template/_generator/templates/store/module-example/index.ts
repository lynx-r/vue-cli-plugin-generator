import { Module } from 'vuex'
import { StateInterface } from '../models'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state, { <%= name.pascalCase %>StateInterface } from './state'

const <%= name.camelCase %>: Module<<%= name.pascalCase %>StateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

export default <%= name.camelCase %>
