#! /usr/bin/env node
const inquirer = require('inquirer');
const calculateSize = require('./src/calculate');
const formatMessage = require('./src/format');

inquirer
  .prompt([
    {
      name: 'measurements.wallGap',
      default: '0.5 in',
      message: 'How large are the floor gaps?',
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
    },
    {
      name: 'measurements.boardSize',
      message: ({ dimension }) =>
        `How ${dimension === 'width'
          ? 'wide'
          : 'long'} is the board? (include unit)`,
    },
    {
      name: 'measurements.minBoardSize',
      message: ({ dimension }) =>
        `What is the minimum ${dimension} for a board (include unit)?`,
    },
  ])
  .then(calculateSize)
  .then(formatMessage)
  .then(str => {
    console.log(str);
  });
