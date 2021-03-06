const { round } = require('mathjs');
const chalk = require('chalk');

function formatInches(value) {
  const roundedValue = round(value, 3);
  return [roundedValue, roundedValue === 1 ? 'inch' : 'inches'].join(' ');
}

function formatWholeBoards(boards) {
  return `${chalk.bold(boards)} whole board${boards === 1 ? '' : 's'}`;
}

function formatPartialBoard(remainder) {
  return `${chalk.bold(formatInches(remainder))} of one board`;
}

function formatBoardSize(size, boardSize) {
  return size % boardSize < 1
    ? formatWholeBoards(size / boardSize)
    : formatPartialBoard(size);
}

function formatDivider(str) {
  return str.repeat(50);
}

function formatHeader(str) {
  return ['', chalk.bold(str), formatDivider('-')].join('\n');
}

function formatInstructions(order, { boardSize }) {
  return [
    formatHeader('Instructions (starting from the corner)'),
    ...order.map((v, i) => `${i + 1}. Lay ${formatBoardSize(v, boardSize)}`),
  ].join('\n');
}

function formatSupplies(order, { boardSize }) {
  const sortedOrder = []
    .concat(order)
    .sort((a, b) => a < b)
    .map(v => `* ${formatBoardSize(v, boardSize)}`);

  return [formatHeader('Supplies'), ...sortedOrder].join('\n');
}

function formatError(warn) {
  if (!warn) return;

  return chalk.yellow(
    [
      formatDivider('-'),
      'The flooring can not be laid in',
      'accordance with the requirements',
      'This is the closest implementation we',
      'were able to calculate',
      formatDivider('-'),
    ].join('\n')
  );
}

module.exports = function formatCalculation({ measurements, order, warn }) {
  return [
    formatError(warn),
    formatSupplies(order, measurements),
    formatInstructions(order, measurements),
  ]
    .filter(str => !!str && !!str.trim().length)
    .join('\n');
};
