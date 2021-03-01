import { MutationTree } from 'vuex'
import { <%= name.pascalCase %>MutationTypes } from './<%= name.kebabCase %>-mutation-types'
import { <%= name.pascalCase %>StateInterface } from './state'

export type <%= name.pascalCase %>Mutations<S = <%= name.pascalCase %>StateInterface> = {
  [<%= name.pascalCase %>MutationTypes.SOME_MUTATION](state: S, payload: boolean): void
}

const mutation: MutationTree<<%= name.pascalCase %>StateInterface> & <%= name.pascalCase %>Mutations = {
  [<%= name.pascalCase %>MutationTypes.SOME_MUTATION](state, payload) {
    state.prop = payload
    // your code
  }
}

export default mutation
