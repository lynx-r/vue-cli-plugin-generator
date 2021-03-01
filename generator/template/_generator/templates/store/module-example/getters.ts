import { GetterTree } from 'vuex'
import { StateInterface } from '../models'
import { <%= name.pascalCase %>StateInterface } from './state'

type Getters = {
  someAction(state: <%= name.pascalCase %>StateInterface): boolean
}

export type <%= name.pascalCase %>Getters = {
  [K in keyof Getters as `<%= name.camelCase %>/${K extends symbol ? never : K}`]: ReturnType<Getters[K]>
}

const getters: GetterTree<<%= name.pascalCase %>StateInterface, StateInterface> & Getters = {
  someAction(state) {
    return state.prop
    // your code
  }
}

export default getters
