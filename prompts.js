const path = require('path');

let questions = [];

module.exports = api => {
  if (api.scripts.make) {
    const generatorConfig = require(path.resolve(process.cwd() + '/generator.config.js'));

    if (generatorConfig) {
      const {templates} = generatorConfig;

      const types = templates
        .map(type => (
          {
            name: type.label,
            value: type.name,
          }
        ));

      // Check if file need to be renamed
      const renameFileQuestion = templates
        .filter(type => type?.renameFile)
        .map(type => (
          {
            type: 'input',
            name: 'name',
            message: `Name for the ${type.label}?`,
            group: `${type.name}`,
            validate: input => !!input,
            when: answers => answers.type === `${type.name}`,
          }
        ));

      const customPrompts = templates.flatMap(type => type.prompts);

      questions = [
        {
          type: 'list',
          name: 'type',
          message: 'What do you want to generate?',
          choices: [
            ...types
          ],
        },
        ...renameFileQuestion,
        ...customPrompts
      ];
    } else {
      throw 'No `generator.config.js` in you root folder.';
    }
  }

  return questions;
};
