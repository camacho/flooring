const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const markdownMagic = require('markdown-magic');
const INSTALLCMD = require('markdown-magic-install-command');

const rootDir = path.resolve(__dirname, '..');
const markdownPaths = [`${rootDir}/**.md`, `!${rootDir}/node_modules/**`];

// Add any configurations here
const config = {
  transforms: {
    INSTALLCMD,
    ENGINES: () => {
      const { engines } = JSON.parse(
        fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
      );

      return Object.keys(engines)
        .map(name => `* **${name}**: ${engines[name]}`)
        .join('\n');
    },
  },
};

// Callback to be executed when completed
function stage(err, output) {
  if (err) return;

  const files = output.map(data => data.outputFilePath).filter(file => !!file);

  if (!files.length) return;

  execSync(`git add ${files.join(' ')}`);
}

markdownMagic(markdownPaths, config, stage);
