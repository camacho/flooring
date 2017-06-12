#! /usr/bin/env node
const inquirer = require('inquirer');
const { unit } = require('mathjs');
const storage = require('node-persist');

const calculateSize = require('./src/calculate');
const formatMessage = require('./src/format');

function validateFormat(v) {
  if (!v || !v.trim().length) return 'Enter a value';

  try {
    unit(v).toNumber('in');
    return true;
  } catch (err) {
    return 'Please enter a valid format syntax - e.g. "10 in"';
  }
}

storage
  .init()
  .then(() => storage.getItem('answers'))
  .then(
    answers =>
      answers || {
        dimension: 'length',
        measurements: {
          wallGap: '0.25 in',
          step: '0.25 in',
        },
      }
  )
  .then(defaults =>
    inquirer.prompt([
      {
        name: 'measurements.wallGap',
        default: defaults.measurements.wallGap,
        message: 'How large are the wall gaps?',
        validate: validateFormat,
      },
      {
        name: 'measurements.step',
        default: defaults.measurements.step,
        message:
          'What size step should be used for randomization? (include unit)',
      },
      {
        name: 'dimension',
        type: 'list',
        message: 'What is the dimension you wish to calculate?',
        choices: ['length', 'width'],
        default: defaults.dimension,
      },
      {
        name: 'measurements.floorSize',
        message: ({ dimension }) =>
          `How ${dimension === 'width'
            ? 'wide'
            : 'long'} is the floor? (include unit)`,
        validate: validateFormat,
        default: defaults.measurements.floorSize,
      },
      {
        name: 'measurements.boardSize',
        message: ({ dimension }) =>
          `How ${dimension === 'width'
            ? 'wide'
            : 'long'} is the board? (include unit)`,
        validate: validateFormat,
        default: defaults.measurements.boardSize,
      },
      {
        name: 'measurements.minBoardSize',
        message: ({ dimension }) =>
          `What is the minimum ${dimension} for a board? (include unit)`,
        validate: validateFormat,
        default: defaults.measurements.minBoardSize,
      },
    ])
  )
  .then(answers => storage.setItem('answers', answers).then(() => answers))
  .then(calculateSize)
  .then(formatMessage)
  .then(str => {
    console.log(str);
    console.log('');
  });
