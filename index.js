#! /usr/bin/env node
const inquirer = require('inquirer');
const { unit } = require('mathjs');
const storage = require('node-persist');

const calculateSize = require('./src/calculate');
const formatMessage = require('./src/format');

const confirm =
  process.argv.includes('--confirm') || process.argv.includes('-c');

function validateFormat(v) {
  if (!v || !v.trim().length) return 'Enter a value';

  try {
    unit(v).toNumber('in');
    return true;
  } catch (err) {
    return 'Please enter a valid format syntax - e.g. "10 in"';
  }
}

function when(lookup) {
  return !(confirm && lookup);
}

storage
  .init()
  .then(() => storage.getItem('answers'))
  .then(
    answers =>
      answers || {
        measurements: {
          wallGap: '0.25 in',
          step: '0.25 in',
        },
      }
  )
  .then(defaults =>
    inquirer
      .prompt([
        {
          name: 'measurements.wallGap',
          default: defaults.measurements.wallGap,
          message: 'How large are the wall gaps?',
          validate: validateFormat,
          when: when(defaults.measurements.wallGap),
        },
        {
          name: 'measurements.step',
          default: defaults.measurements.step,
          message:
            'What size step should be used for randomization? (include unit)',
          when: when(defaults.measurements.step),
        },
        {
          name: 'dimension',
          type: 'list',
          message: 'What is the dimension you wish to calculate?',
          choices: ['length', 'width'],
          default: defaults.dimension,
          when: when(defaults.dimension),
        },
        {
          name: 'measurements.floorSize',
          message: ({ dimension }) =>
            `How ${dimension === 'width'
              ? 'wide'
              : 'long'} is the floor? (include unit)`,
          validate: validateFormat,
          default: defaults.measurements.floorSize,
          when: when(defaults.measurements.floorSize),
        },
        {
          name: 'measurements.boardSize',
          message: ({ dimension }) =>
            `How ${dimension === 'width'
              ? 'wide'
              : 'long'} is the board? (include unit)`,
          validate: validateFormat,
          default: defaults.measurements.boardSize,
          when: when(defaults.measurements.boardSize),
        },
        {
          name: 'measurements.minBoardSize',
          message: ({ dimension }) =>
            `What is the minimum ${dimension} for a board? (include unit)`,
          validate: validateFormat,
          default: defaults.measurements.minBoardSize,
          when: when(defaults.measurements.minBoardSize),
        },
      ])
      .then(answers => {
        const results = Object.assign({}, defaults, answers);
        results.measurements = Object.assign(
          {},
          defaults.measurements,
          answers.measurements
        );
        return results;
      })
  )
  .then(answers => storage.setItem('answers', answers).then(() => answers))
  .then(calculateSize)
  .then(formatMessage)
  .then(str => {
    console.log(str);
    console.log('');
  });
