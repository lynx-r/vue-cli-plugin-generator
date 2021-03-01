const {camelCase, upperFirst, kebabCase} = require('lodash/string');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TEMPLATE_FOLDER_LOCATION = '.generator/templates/';

const getNamings = (string) => ({
  value: string,
  camelCase: camelCase(string),
  pascalCase: upperFirst(camelCase(string)),
  kebabCase: kebabCase(string),
});

const stripMargin = content => content.replace(/^[ ]*\|/gm, '');

/**
 * Escape regular expressions.
 *
 * @param {string} str string
 * @returns {string} string with regular expressions escaped
 */
const escapeRegExp = str => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line
};


/**
 * Normalize line endings.
 * If in Windows is Git autocrlf used then need to replace \r\n with \n
 * to achieve consistent comparison result when comparing strings read from file.
 *
 * @param {string} str string
 * @returns {string} string where CRLF is replaced with LF in Windows
 */
const normalizeLineEndings = str => {
  const isWin32 = os.platform() === 'win32';
  return isWin32 ? str.replace(/\r\n/g, '\n') : str;
};

/**
 * Rewrite using the passed argument object.
 *
 * @param {object} args arguments object (containing splicable, haystack, needle properties) to be used
 * @returns {*} re-written file
 */
const rewrite = args => {
  // check if splicable is already in the body text
  const re = new RegExp(args.splicable
    .map(line => `\\s*${escapeRegExp(normalizeLineEndings(line))}`)
    .join('\n')
  );

  if (re.test(normalizeLineEndings(args.haystack))) {
    return args.haystack;
  }

  const lines = args.haystack.split('\n');

  let otherwiseLineIndex = -1;
  lines.forEach((line, i) => {
    if (line.includes(args.needle)) {
      otherwiseLineIndex = i;
    }
  });

  let spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  let spaceStr = '';

  // eslint-disable-next-line no-cond-assign
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  lines.splice(otherwiseLineIndex, 0, args.splicable.map(line => spaceStr + line).join('\n'));

  return lines.join('\n');
};

const writeFile = ({filePath, body}) => {
  const w = (resolve, reject) => {
    const writeFileCb = (err) => {
      if (err) {
        reject(err);
        console.error('error occurred while writing file: ', filePath);
        return;
      }
      resolve();
    };

    fs.writeFile(filePath, body, writeFileCb);
  };

  return new Promise(w);
};

/**
 * insert splicable in place of needls
 * @param api
 * @param target
 * @returns {Promise<unknown>}
 */
const insertSplicableUnderNeedles = (api, target) =>
  new Promise((resolve, reject) => {
    const {basePath, name, splicable: splicableRaw, needle, file: {template, project}} = target;
    const filePath = path.resolve(basePath, project);
    const templateFilePath = path.resolve(TEMPLATE_FOLDER_LOCATION, template);

    const insertSplicables = (err, data) => {
      if (!!err) {
        reject(err);
        console.error('error occurred while reading file: ', filePath);
        return;
      }

      const haystack = data.toString();

      const evaluate = (s, i) => {
        const comma = i === 0 ? ',' : '';
        return eval('`' + stripMargin(s) + '`');
      };
      const splicable = splicableRaw.map(evaluate);

      const args = {
        needle,
        haystack,
        splicable,
      };
      const body = rewrite(args);
      resolve({body, filePath});
    };

    const readFileCb = () => {
      fs.readFile(filePath, insertSplicables);
    };

    fs.copyFile(templateFilePath, filePath, fs.constants.COPYFILE_EXCL, readFileCb);
  });

const resolveTemplate = (template, name, basePath, api) =>
  Object
    .keys(template)
    .reduce((acc, cur) => {
      const evalTemplateFile = eval('`' + template[cur] + '`');
      const templateFile = api.resolve(TEMPLATE_FOLDER_LOCATION, evalTemplateFile);

      const evalProjectFile = eval('`' + cur + '`');
      const projectFile = path.join(basePath, evalProjectFile);

      acc[projectFile] = templateFile;
      return acc;
    }, {});

const rewriteNeedledFiles = async (rewriteFiles, name, basePath, api) => {
  if (rewriteFiles?.length) {
    // put init file props to every part for overriding
    const f = rewriteFiles.flatMap(f => f.parts.map(p => ({...p, file: f.file})))
    for (const target of f) {
      const args = {
        ...target,
        name,
        basePath
      };
      await insertSplicableUnderNeedles(api, args).then(writeFile);
    }
  }
};

module.exports = async (api, options) => {
  const generatorConfig = require(api.resolve('generator.config.js')) || require(api.resolve('.generator/generator.config.js'));

  if (!generatorConfig?.templates?.length) {
    throw 'No Template file found';
  }

  const {templates, basePath} = generatorConfig;
  const templateObject = templates.find(template => template.name === options.type);

  if (templateObject) {
    const n = options.name || templateObject.name;
    const name = getNamings(n);
    const {template, rewriteFiles} = templateObject;

    const files = resolveTemplate(template, name, basePath, api);
    api.render(files, {...options, name});

    await rewriteNeedledFiles(rewriteFiles, name, basePath, api);
  } else {
    throw 'No Template selected';
  }

};
