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

  const size = floorSize - wallGap * 2;
  let numberOfWholeBoards = Math.floor(size / boardSize);
  let extraSpace = round(size % boardSize, 3);

  if (numberOfWholeBoards > 0) {
    extraSpace += boardSize;
    numberOfWholeBoards--;
  }

  const warn = extraSpace < minBoardSize;

  // board can be 0
  // board can be min size to extra space - minimumSize
  // board can be full length

  // Figure out how many choices we have
  const numberOfChoices =
    2 + Math.floor((extraSpace - 2 * minBoardSize) / step);
  const choice = getRandomIntInclusive(0, numberOfChoices);
  let firstBoard;
  let secondBoard;

  if (choice === numberOfChoices) {
    firstBoard = extraSpace;
    secondBoard = 0;
  } else if (choice === 0) {
    firstBoard = 0;
    secondBoard = extraSpace;
  } else {
    firstBoard = minBoardSize + step * choice;
    secondBoard = extraSpace - firstBoard;
  }

  if (firstBoard) order.push(firstBoard);
  if (numberOfWholeBoards) order.push(numberOfWholeBoards * boardSize);
  if (secondBoard) order.push(secondBoard);

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
