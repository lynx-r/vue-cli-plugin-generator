import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex'

// needle-add-module-imports-to-models

type Mutations =
// needle-add-mutation-to-type-mutations
//   AuthMutations
//   & HomeMutations
//   & ProfileMutations
//   & ArticleMutations

type Actions =
  // needle-add-action-to-type-actions
  // HomeActions
  // & AuthActions
  // & ProfileActions
  // & ArticleActions

type Getters =
  // needle-add-getter-to-type-getters
  // HomeGetters
  // & AuthGetters
  // & ProfileGetters
  // & ArticleGetters

// exported

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.

  // needle-add-module-state-interface-to-root-state-interface
  // home: HomeStateInterface,
  // auth: AuthStateInterface,
  // profile: ProfileStateInterface,
  // article: ArticleStateInterface
}

export type Commit = {
  <K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): void
}

export type DispatchReturnType<K extends keyof Actions> = ReturnType<Actions[K]>

export type Dispatch = {
  <K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>
}

export type Store =
  Omit<VuexStore<StateInterface>, 'getters' | 'commit' | 'dispatch'>
  & { commit: Commit }
  & { dispatch: Dispatch }
  & { getters: Getters }

export type QualifierFor = 'mutation' | 'action'

export type QualifiedKeyType<T> = T extends 'mutation' ? keyof Mutations : keyof Actions

export interface StateWithModuleName {
  readonly moduleName: string
}
