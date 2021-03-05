import { createStore } from 'vuex'

// needle-add-module-to-store-import

import {
  Commit,
  Dispatch,
  DispatchReturnType,
  QualifiedKeyType,
  QualifierFor,
  StateWithModuleName,
  Store
} from './models'

const modules = {
// needle-add-module-to-modules-object
}

const store = createStore({
  modules
})

/**
 * wraps origin store.dispatch to add '[moduleName]/'
 */
const dispatchWrapped = store.dispatch

const dispatchWrapper: Dispatch = (key, payload, options) => {
  const type = qualifyKey('mutation', key)
  return dispatchWrapped(type, payload, options) as DispatchReturnType<typeof key>
}

store.dispatch = dispatchWrapper

// end newDispatch

/**
 * wraps origin store.dispatch to add '[moduleName]/'
 */
const commitWrapped = store.commit

const commitWrapper: Commit = (key, payload, options) => {
  const type = qualifyKey('action', key)
  commitWrapped(type, payload, options)
}

store.commit = commitWrapper

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

  // needle-add-module-state-interface-to-root-state-interface
}

export function useStore(): Store {
  return store
}
