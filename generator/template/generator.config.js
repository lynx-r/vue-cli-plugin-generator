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
      prompts: []
    },
    {
      name: 'module',
      label: 'Module',
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        ['./src/store/${name.kebabCase}/actions.ts']: 'module-example/actions.ts',
        ['./src/store/${name.kebabCase}/${name.kebabCase}-action-types.ts']: 'module-example/example-action-types.ts',
        ['./src/store/${name.kebabCase}/${name.kebabCase}-mutation-types.ts']: 'module-example/example-mutation-types.ts',
        ['./src/store/${name.kebabCase}/getters.ts']: 'module-example/getters.ts',
        ['./src/store/${name.kebabCase}/index.ts']: 'module-example/index.ts',
        ['./src/store/${name.kebabCase}/mutations.ts']: 'module-example/mutations.ts',
        ['./src/store/${name.kebabCase}/state.ts']: 'module-example/state.ts'
      },
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
}
