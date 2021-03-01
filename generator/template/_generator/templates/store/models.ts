import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex'
import { ArticleStateInterface } from '~/store/article/state'
import { AuthStateInterface } from '~/store/auth/state'
import { HomeStateInterface } from '~/store/home/state'
import { ProfileStateInterface } from '~/store/profile/state'
import { ArticleActions } from './article/actions'
import { ArticleGetters } from './article/getters'
import { ArticleMutations } from './article/mutations'
import { AuthActions } from './auth/actions'
import { AuthGetters } from './auth/getters'
import { AuthMutations } from './auth/mutations'
import { HomeActions } from './home/actions'
import { HomeGetters } from './home/getters'
import { HomeMutations } from './home/mutations'
import { ProfileActions } from './profile/actions'
import { ProfileGetters } from './profile/getters'
import { ProfileMutations } from './profile/mutations'

type Mutations = AuthMutations & HomeMutations & ProfileMutations & ArticleMutations

type Actions = HomeActions & AuthActions & ProfileActions & ArticleActions

type Getters = HomeGetters & AuthGetters & ProfileGetters & ArticleGetters

// exported

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  home: HomeStateInterface,
  auth: AuthStateInterface,
  profile: ProfileStateInterface,
  article: ArticleStateInterface
}

export type Commit = {
  <K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): void
}

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
