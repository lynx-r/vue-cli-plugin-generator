module.exports = {
  templates: [
    {
      name: 'composition',
      label: 'Composition',
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        './src/components/${name.pascalCase}.vue': 'composition.vue'
      },
      renameFile: true, // Rename file question
      prompts: [
        // Custom Questions
        {
          type: 'confirm',
          name: 'scoped',
          message: 'This component with scoped styling?',
          default: true,
          group: 'composition',
          when: answers => answers.type === 'composition',
        },
      ]
    },
    {
      name: 'view',
      label: 'View',
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        './src/views/${name.pascalCase}.vue': 'view.vue'
      },
      rewriteFiles: [
        {
          file: {
            template: 'router-views.ts',
            project: './src/router/views.ts'
          },
          parts: [
            {
              needle: 'needle-add-view-to-router-import',
              splicable: [
                '|const ${name.pascalCase} = () => import(\'@/views/${name.pascalCase}.vue\');'
              ]
            },
            {
              needle: 'needle-add-view-to-router',
              splicable: [
                `|    {
             |      path: '/\${name.kebabCase}',
             |      name: '\${name.pascalCase}',
             |      component: \${name.pascalCase},
             |    },`
              ]
            }
          ]
        }
      ],
      renameFile: true, // Rename file question
      prompts: [
        // Custom Questions
        {
          type: 'confirm',
          name: 'scoped',
          message: 'This component with scoped styling?',
          default: true,
          group: 'view',
          when: answers => answers.type === 'view',
        },
      ]
    },
    {
      name: 'module',
      label: 'Module',
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        './src/store/${name.kebabCase}/actions.ts': 'store/module-example/actions.ts',
        './src/store/${name.kebabCase}/${name.kebabCase}-action-types.ts': 'store/module-example/example-action-types.ts',
        './src/store/${name.kebabCase}/${name.kebabCase}-mutation-types.ts': 'store/module-example/example-mutation-types.ts',
        './src/store/${name.kebabCase}/getters.ts': 'store/module-example/getters.ts',
        './src/store/${name.kebabCase}/index.ts': 'store/module-example/index.ts',
        './src/store/${name.kebabCase}/mutations.ts': 'store/module-example/mutations.ts',
        './src/store/${name.kebabCase}/state.ts': 'store/module-example/state.ts'
      },
      rewriteFiles: [
        {
          file: {
            template: 'store/index.ts',
            project: './src/store/index.ts'
          },
          parts: [
            {
              needle: 'needle-add-module-to-store-import',
              splicable: [
                'import ${name.camelCase} from \'./${name.kebabCase}\'',
                'import { ${name.pascalCase}StateInterface } from \'./${name.kebabCase}/state\'',
              ]
            },
            {
              needle: 'needle-add-module-to-modules-object',
              splicable: [
                '${name.camelCase},',
              ]
            },
            {
              needle: 'needle-add-module-state-interface-to-root-state-interface',
              splicable: [
                '${name.camelCase}: ${name.pascalCase}StateInterface,',
              ]
            }
          ]
        },
        {
          file: {
            template: 'store/models.ts',
            project: './src/store/models.ts'
          },
          parts: [
            {
              needle: 'needle-add-module-imports-to-models',
              splicable: [
                ` |import { \${name.pascalCase}StateInterface } from '@/store/\${name.kebabCase}/state'
                  |import { \${name.pascalCase}Actions } from './\${name.kebabCase}/actions'
                  |import { \${name.pascalCase}Getters } from './\${name.kebabCase}/getters'
                  |import { \${name.pascalCase}Mutations } from './\${name.kebabCase}/mutations'`
              ]
            },
            {
              needle: 'needle-add-mutation-to-type-mutations',
              splicable: [
                // it adds '&' before '=' but it is legal
                '& \${name.pascalCase}Mutations',
              ]
            },
            {
              needle: 'needle-add-action-to-type-actions',
              splicable: [
                '& \${name.pascalCase}Actions',
              ]
            },
            {
              needle: 'needle-add-getter-to-type-getters',
              splicable: [
                '& \${name.pascalCase}Getters',
              ]
            },
            {
              needle: 'needle-add-module-state-interface-to-root-state-interface',
              splicable: [
                '${name.camelCase}: ${name.pascalCase}StateInterface,',
              ]
            }
          ]
        }
      ],
      renameFile: true, // Rename file question
      prompts: []
    },
    {
      name: 'component',
      label: 'Component',
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        ['./src/components/${name.pascalCase}.vue']: 'component.vue'
      },
      renameFile: true, // Rename file question
      prompts: [
        // Custom Questions
        {
          type: 'confirm',
          name: 'scoped',
          message: 'This component with scoped styling?',
          default: true,
          group: 'component',
          when: answers => answers.type === 'component',
        },
      ]
    },
  ]
};
