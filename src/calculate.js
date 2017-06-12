const { unit, round } = require('mathjs');

function convertInput(input) {
  const output = {};

  Object.keys(input).forEach(v => {
    output[v] = round(unit(input[v]).toNumber('in'), 3);
  });

  return output;
}

function getRandomIntInclusive(_min, _max) {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateLength({
  wallGap,
  floorSize,
  boardSize,
  minBoardSize,
  step,
}) {
  const order = [];
  let warn = false;

  const size = floorSize - wallGap * 2;
  let numberOfWholeBoards = Math.floor(size / boardSize);
  let remainder = round(size % boardSize, 3);

  if ((boardSize + remainder) / 2 < minBoardSize) {
    order.push(numberOfWholeBoards * boardSize, remainder);
    warn = true;
  } else if (numberOfWholeBoards === 0) {
    order.push(remainder);
  } else {
    if (Math.floor(remainder / 2) < minBoardSize) {
      remainder += boardSize;
      numberOfWholeBoards--;
    }

    const wiggleRoom = remainder - 2 * minBoardSize;
    const maxWiggle = Math.floor(wiggleRoom / step);
    const multiplier = getRandomIntInclusive(1, maxWiggle);
    const adjustment = minBoardSize + multiplier * step;

    const firstBoard = adjustment;
    const lastBoard = size - adjustment - numberOfWholeBoards * boardSize;

    order.push(firstBoard, numberOfWholeBoards * boardSize, lastBoard);
  }

  return { order, warn };
}

function calculateWidth({ wallGap, floorSize, boardSize, minBoardSize, step }) {
  const order = [];
  let warn = false;

  const size = floorSize - wallGap * 2;
  const numberOfWholeBoards = Math.floor(size / boardSize);
  const remainder = size % boardSize;

  if (remainder === 0) {
    order.push(size);
  } else if (remainder >= minBoardSize) {
    order.push(numberOfWholeBoards * boardSize, remainder);
  } else if (remainder / 2 >= minBoardSize) {
    const offset = remainder / 2;
    order.push(offset, (numberOfWholeBoards - 1) * boardSize, offset);
  } else {
    let firstBoard = boardSize;
    let lastBoard = remainder;

    do {
      lastBoard += step;
      firstBoard -= step;
    } while (lastBoard < minBoardSize);

    warn = firstBoard < minBoardSize;

    order.push(firstBoard, (numberOfWholeBoards - 1) * boardSize, lastBoard);
  }

  return { order, warn };
}

module.exports = function calculateSize(answers) {
  const measurements = convertInput(answers.measurements);

  if (answers.dimension === 'width') {
    const { order, warn } = calculateWidth(measurements);
    return { measurements, order, warn };
  } else {
    const { order, warn } = calculateLength(measurements);
    return { measurements, order, warn };
  }
};
