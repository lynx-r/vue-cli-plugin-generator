import { StateWithModuleName } from '../models'

export interface <%= name.pascalCase %>StateInterface extends StateWithModuleName {
  prop: boolean
}

const state:  <%= name.pascalCase %>StateInterface = {
  moduleName: '<%= name.camelCase %>',
  prop: false
}

export default state
