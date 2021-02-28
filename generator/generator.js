const {camelCase, upperFirst, kebabCase} = require('lodash/string');
const fs = require('fs');
const os = require('os');

const getNamings = string => ({
  value: string,
  camelCase: camelCase(string),
  pascalCase: upperFirst(camelCase(string)),
  kebabCase: kebabCase(string),
});

function stripMargin(content) {
  return content.replace(/^[ ]*\|/gm, '');
}


/**
 * Escape regular expressions.
 *
 * @param {string} str string
 * @returns {string} string with regular expressions escaped
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line
}


/**
 * Normalize line endings.
 * If in Windows is Git autocrlf used then need to replace \r\n with \n
 * to achieve consistent comparison result when comparing strings read from file.
 *
 * @param {string} str string
 * @returns {string} string where CRLF is replaced with LF in Windows
 */
function normalizeLineEndings(str) {
  const isWin32 = os.platform() === 'win32';
  return isWin32 ? str.replace(/\r\n/g, '\n') : str;
}

/**
 * Rewrite using the passed argument object.
 *
 * @param {object} args arguments object (containing splicable, haystack, needle properties) to be used
 * @returns {*} re-written file
 */
function rewrite(args) {
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
}

async function rewriteFile(api, target) {

  const rw = (resolve, reject) => {
    const path = /*'/Volumes/Local/IdeaProjects/examples/deno/test.txt' ||*/ target.file;
    const resolveProjectFile = api.resolve(path);

    const rewriteFileCb = (err, data) => {
      if (!!err) {
        reject(err);
        console.log('error while reading a file');
        return;
      }
      const writeFileCb = (err) => {
        if (err) {
          reject(err);
          console.log(err);
          return;
        }
        resolve(target);
        console.log('file overridden', body);
      };

      const haystack = data.toString();
      console.log('read file', haystack);
      const e = (s, i) => {
        const name = target.name;
        const comma = i === 0 ? ',' : '';
        return eval('`' + s + '`');
      };
      const splicable = target.splicable.map(stripMargin).map(e);
      const args = {
        ...target,
        haystack,
        splicable
      };
      const body = rewrite(args);
      fs.writeFile(path, body, writeFileCb);
    };

    fs.readFile(target.file, rewriteFileCb);
  };

  return await new Promise(rw);
}

module.exports = (api, options) => {
  const generatorConfig = require(api.resolve('generator.config.js')) || require(api.resolve('.generator/generator.config.js'));

  if (!(generatorConfig && generatorConfig.templates)) {
    throw 'No Template file found';
  }

  const templateObject = generatorConfig.templates.find(template => template.name === options.type);

  const templateFolderLocation = '.generator/templates/';

  if (templateObject) {
    let files = {};
    let {name} = templateObject;

    if (options.name) {
      options.name = getNamings(options.name);
      name = options.name;
    }

    Object.keys(templateObject.template).forEach(target => {
      const resolveTemplateFile = api.resolve(templateFolderLocation + templateObject.template[target]);
      files[[eval('`' + target + '`')]] = eval('`' + resolveTemplateFile + '`');

    });

    api.render(files, {
      ...options
    });

    templateObject.rewriteFiles.forEach(async (target) => {
      target.name = name;
      await rewriteFile(api, target);
    });

  } else {
    throw 'No Template selected';
  }

};
