#! /usr/bin/env node
const inquirer = require('inquirer');
const { unit } = require('mathjs');
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

inquirer
  .prompt([
    {
      name: 'measurements.wallGap',
      default: '0.5 in',
      message: 'How large are the floor gaps?',
      validate: validateFormat,
    },
    {
      name: 'dimension',
      type: 'list',
      message: 'What is the dimension you wish to calculate?',
      choices: ['width', 'length'],
      default: 'width',
    },
    {
      name: 'measurements.floorSize',
      message: ({ dimension }) =>
        `How ${dimension === 'width'
          ? 'wide'
          : 'long'} is the floor? (include unit)`,
      validate: validateFormat,
    },
    {
      name: 'measurements.boardSize',
      message: ({ dimension }) =>
        `How ${dimension === 'width'
          ? 'wide'
          : 'long'} is the board? (include unit)`,
      validate: validateFormat,
    },
    {
      name: 'measurements.minBoardSize',
      message: ({ dimension }) =>
        `What is the minimum ${dimension} for a board? (include unit)`,
      validate: validateFormat,
    },
  ])
  .then(calculateSize)
  .then(formatMessage)
  .then(str => {
    console.log(str);
    console.log('');
  });
