import { Module } from 'vuex'
import { StateInterface } from '../models'
import actions from 'generator/template/_generator/templates/module-example/actions'
import getters from 'generator/template/_generator/templates/module-example/getters'
import mutations from 'generator/template/_generator/templates/module-example/mutations'
import state, { <%= name.pascalCase %>StateInterface } from './state'

const <%= name.camelCase %>: Module<<%= name.pascalCase %>StateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

export default <%= name.camelCase %>
