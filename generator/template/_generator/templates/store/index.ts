import { createStore } from 'vuex'
import article from './article'
import { ArticleStateInterface } from './article/state'
import auth from './auth'
import { AuthStateInterface } from './auth/state'
import home from './home'
import { HomeStateInterface } from './home/state'
import { Commit, Dispatch, QualifiedKeyType, QualifierFor, StateWithModuleName, Store } from './models'
import profile from './profile'
import { ProfileStateInterface } from './profile/state'

const modules = {

}

const store = createStore({
  modules
})

/**
 * override origin store.dispatch to add '[moduleName]/'
 */
const origDispatch = store.dispatch

const newDispatch: Dispatch = (key, payload, options) => {
  const type = qualifyKey('mutation', key)
  return origDispatch(type, payload, options)
}

store.dispatch = newDispatch

// end newDispatch

/**
 * override origin store.dispatch to add '[moduleName]/'
 */
const origCommit = store.commit

const newCommit: Commit = (key, payload, options) => {
  const type = qualifyKey('action', key)
  origCommit(type, payload, options)
}

store.commit = newCommit

// end newCommit

const qualifyKey = <T extends QualifierFor>(type: QualifierFor, key: QualifiedKeyType<T>) => {
  const module = Object
    .values(modules)
    .find((m) => {
      const keys = [...Object.keys(m.actions!), Object.keys(m.mutations!)]
      if (keys.includes(key)) {
        return m
      }
    })

  return !!module
    ? (module.state as StateWithModuleName).moduleName + '/' + key
    : key
}

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  home: HomeStateInterface,
  auth: AuthStateInterface,
  profile: ProfileStateInterface,
  article: ArticleStateInterface
}

export function useStore(): Store {
  return store
}
