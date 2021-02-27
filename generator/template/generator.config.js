module.exports = {
  templates: [
    {
      name: 'component',
      label: 'Component',
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        ['./src/components/${name.pascalCase}.vue']: 'component.vue'
      },
      renameFile: true, // Rename file question
      rewriteFiles: [
        {
          file: `./client/src/router/views.ts`,
          needle: 'needle-add-view-to-router-import',
          splicable: [
            '|const ${name.pascalCase} = () => import(\'@/views/${name.pascalCase}.vue\');'
          ]
        },
        {
          file: `./client/src/router/views.ts`,
          needle: 'needle-add-view-to-router',
          splicable: [`
             |    {
             |      path: '/${name.kebabCase}',
             |      name: '${name.pascalCase}',
             |      component: ${name.pascalCase},
             |    },
            `
          ]
        }
      ],
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
