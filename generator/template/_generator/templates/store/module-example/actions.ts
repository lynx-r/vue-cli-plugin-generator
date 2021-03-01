import { ActionContext, ActionTree, CommitOptions } from 'vuex'
import { StateInterface } from '../models'
import { <%= name.pascalCase %>ActionTypes } from './<%= name.kebabCase %>-action-types'
import { <%= name.pascalCase %>MutationTypes } from './<%= name.kebabCase %>-mutation-types'
import { <%= name.pascalCase %>Mutations } from './mutations'
import { <%= name.pascalCase %>StateInterface } from './state'

type AugmentedActionContext = {
  commit<K extends keyof <%= name.pascalCase %>Mutations>(
    key: K,
    payload?: Parameters<<%= name.pascalCase %>Mutations[K]>[1],
    options?: CommitOptions
  ): ReturnType<<%= name.pascalCase %>Mutations[K]>
} & Omit<ActionContext<<%= name.pascalCase %>StateInterface, StateInterface>, 'commit'>

export interface <%= name.pascalCase %>Actions {
  [<%= name.pascalCase %>ActionTypes.SOME_ACTION](context: AugmentedActionContext, payload: boolean): Promise<void>
}

const actions: ActionTree<<%= name.pascalCase %>StateInterface, StateInterface> & <%= name.pascalCase %>Actions = {
  [<%= name.pascalCase %>ActionTypes.SOME_ACTION]({commit}, payload) {
    // your code
    commit(<%= name.pascalCase %>MutationTypes.SOME_MUTATION, payload)
    return Promise.resolve()
  }
}

export default actions
