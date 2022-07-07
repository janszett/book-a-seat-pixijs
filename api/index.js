const bodyParser = require('body-parser');
const app = require('express')();
const fs = require('fs');

const path = require('path');
const seatDataRaw = fs.readFileSync(path.resolve('./api/seats.json'));
const seatDataJson = JSON.parse(seatDataRaw);
app.use(bodyParser.json());

app.get('/seats', (req, res) => {
  const xMin = parseInt(req.query.xMin) || null;
  const xMax = parseInt(req.query.xMax) || null;
  const yMin = parseInt(req.query.yMin) || null;
  const yMax = parseInt(req.query.yMax) || null;
  let seats = seatDataJson; // get seats from json file
  // let seats = addDummySeats(); // get seats dynamically

  if (xMin) {
    seats = seats.filter(seat => seat.x >= xMin);
  }
  if (xMax) {
    seats = seats.filter(seat => seat.x <= xMax);
  }
  if (yMin) {
    seats = seats.filter(seat => seat.y >= yMin);
  }
  if (yMax) {
    seats = seats.filter(seat => seat.y <= yMax);
  }

  res.json(seats);
});

module.exports = app;

function randomStatus () {
  return Math.round(Math.random());
}

function getCategory (x) {
  if (x < 300) return 1;
  if (x < 600) return 2;
  if (x < 900) return 3;
  return 4;
}

// eslint-disable-next-line no-unused-vars
function addDummySeats () {
  const blocks = 3;
  const blockOffsetY = 500;
  const seatRadius = 20;
  const rows = 7;
  const cols = 12;
  const seats = [];
  for (let blockIndex = 0; blockIndex < blocks; blockIndex++) {
    const offsetY = blockIndex * blockOffsetY;
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const seatX = 3 * seatRadius + (colIndex * seatRadius * 3);
        const seatY = 3 * seatRadius + (rowIndex * seatRadius * 3);
        seats.push({ x: seatX, y: offsetY + seatY, status: randomStatus(), category: getCategory(seatX), id: `${getLetterByIndex(colIndex)}${rowIndex + 1}`, block: blockIndex + 1 });
      }
    }
  }

  return seats;
}

function getLetterByIndex (index) {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Number(index)];
}
