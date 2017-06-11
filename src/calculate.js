const { unit } = require('mathjs');

function convertInput(input) {
  const output = {};

  Object.keys(input).forEach(v => {
    output[v] = unit(input[v]).toNumber('in');
  });

  return output;
}

module.exports = function calculateSize(answers) {
  const measurements = convertInput(answers.measurements);

  const { wallGap, floorSize, boardSize, minBoardSize } = measurements;

  const size = floorSize - wallGap * 2;
  const numberOfWholeBoards = Math.floor(size / boardSize);
  const remainder = size % boardSize;

  const order = [];
  let warn = false;

  if (remainder === 0) {
    order.push(size);
  } else if (remainder >= minBoardSize) {
    order.push(numberOfWholeBoards * boardSize, remainder);
  } else if (remainder / 2 >= minBoardSize) {
    const offset = remainder / 2;
    order.push(offset, (numberOfWholeBoards - 1) * boardSize, offset);
  } else {
    warn = true;

    let firstBoard = boardSize;
    let lastBoard = remainder;

    do {
      lastBoard += 0.125;
      firstBoard -= 0.125;
    } while (lastBoard < minBoardSize);

    order.push(firstBoard, (numberOfWholeBoards - 1) * boardSize, lastBoard);
  }

  return {
    answers,
    measurements,
    order,
    warn,
  };
};
