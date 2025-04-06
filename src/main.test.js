import { Ship } from './Ship.js';
import { Cell } from './Cell.js';
import { Gameboard } from './Gameboard.js';
import { Player, RobotPlayer } from './Player.js';

describe('Ship tests', () => {
  test('Ship constructor throws an error when passing length less than 1 or higher than 4', () => {
    expect(() => {
      new Ship(0);
    }).toThrow(Error);
    expect(() => {
      new Ship(5);
    }).toThrow(Error);
  });
  test('Ship properly defines when it is sunk', () => {
    const ship = new Ship(1);
    expect(ship.isSunk()).toBeFalsy();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});

describe('Gameboard tests', () => {
  describe('Cell tests', () => {
    test('shipRef setter throws an error when passing the wrong type value', () => {
      const cell = new Cell();
      expect(() => {
        cell.setShipRef('Wrong type');
      }).toThrow(Error);
      expect(() => {
        cell.setShipRef(1);
      }).toThrow(Error);
    });
  });

  test('Gameboard is a 10x10 2d array with Cell as each element', () => {
    const gameboard = new Gameboard();
    expect(
      gameboard.board.every((row) =>
        row.every((element) => element instanceof Cell)
      )
    ).toBeTruthy();
    expect(
      gameboard.board.length === 10 &&
        gameboard.board.every((row) => row.length === 10)
    ).toBeTruthy();
  });

  test('4 cells Ship placed horizontally from 0:0 to 0:3 on the board', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(4), 0, 0, false);
    expect(
      gameboard.board.every((row, i) =>
        row.every((cell, j) => {
          if (
            (['0:0', '0:1', '0:2', '0:3'].includes(`${i}:${j}`) &&
              gameboard.getCell(i, j).shipRef === null) ||
            (!['0:0', '0:1', '0:2', '0:3'].includes(`${i}:${j}`) &&
              gameboard.getCell(i, j).shipRef !== null)
          ) {
            return false;
          } else {
            return true;
          }
        })
      )
    ).toBeTruthy();
  });

  test('2 cells Ship placed vertically from 1:1 to 2:1 on the board', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(2), 1, 1, true);
    expect(
      gameboard.board.every((row, i) =>
        row.every((cell, j) => {
          if (
            (['1:1', '2:1'].includes(`${i}:${j}`) &&
              gameboard.getCell(i, j).shipRef === null) ||
            (!['1:1', '2:1'].includes(`${i}:${j}`) &&
              gameboard.getCell(i, j).shipRef !== null)
          ) {
            return false;
          } else {
            return true;
          }
        })
      )
    ).toBeTruthy();
  });

  test('placeShip returns Error when placing Ship out of bounds of Gameboard', () => {
    const gameboard = new Gameboard();
    expect(() => {
      gameboard.placeShip(new Ship(4), 100, 100, false);
    }).toThrow('Can not place a ship in unavailable position');
  });

  test('placeShip returns Error when placing Ship in position where another Ship already placed', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(4), 0, 0, false);
    expect(() => {
      gameboard.placeShip(new Ship(4), 0, 0, false);
    }).toThrow('Can not place a ship in unavailable position');
  });

  test('placeShip returns Error when placing Ship in position adjacent to another Ship', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(1), 0, 0, false);
    expect(() => {
      gameboard.placeShip(new Ship(1), 0, 1, false);
    }).toThrow('Can not place a ship in unavailable position');
  });

  test('receiveAttack returns Error when hitting unavailable position', () => {
    const gameboard = new Gameboard(10);
    expect(() => {
      gameboard.receiveAttack(100, 100);
    }).toThrow('Can not get a cell in unavailable position');
  });

  test('isAllSunk returns proper message when all ships sunk', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(1), 0, 0, false);
    expect(gameboard.isAllSunk()).toBeFalsy();
    gameboard.receiveAttack(0, 0);
    expect(gameboard.isAllSunk()).toBeTruthy();
  });
});

describe('Player tests', () => {
  test('placeShipsRandomly places ships differently with different seeds', () => {
    const player1 = new Player();
    const player2 = new Player();
    const ships = [
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
      new Ship(2),
      new Ship(2),
      new Ship(1),
      new Ship(1),
      new Ship(1),
      new Ship(1),
    ];
    const seedrandom = require('seedrandom');
    const generator1 = seedrandom('hello');
    const generator2 = seedrandom('hi');
    player1.placeShipsRandomly(ships, generator1);
    player2.placeShipsRandomly(ships, generator2);
    const board1 = player1.gameBoard.board;
    const board2 = player2.gameBoard.board;
    expect(
      board1.every((row, i) =>
        row.every((cell, j) => {
          if (
            (board1[i][j].shipRef !== null && board2[i][j].shipRef === null) ||
            (board1[i][j].shipRef === null && board2[i][j].shipRef !== null)
          ) {
            return false;
          } else if (
            board1[i][j].shipRef !== null &&
            board2[i][j].shipRef !== null &&
            board1[i][j].shipRef.length !== board2[i][j].shipRef.length
          ) {
            return false;
          }
          return true;
        })
      )
    ).toBeFalsy();
  });

  test('attackEnemyCell updates state properly', () => {
    const player1 = new Player();
    const player2 = new Player();
    player1.gameBoard.placeShip(new Ship(1), 0, 0, false);
    player2.attackEnemyCell(player1.gameBoard, 0, 0);
    const board1 = player1.gameBoard.board;
    expect(
      board1[0][0].isHitted === true &&
        board1[0][0].shipRef.isSunk() &&
        player1.gameBoard.isAllSunk()
    ).toBeTruthy();
  });
  describe('RobotPlayer tests', () => {
    test('chooseCellToAttack selects each time random Cell to attack', () => {
      const player1 = new RobotPlayer();
      const player2 = new RobotPlayer();
      const board1 = player1.gameBoard.board;
      const board2 = player2.gameBoard.board;
      const seedrandom = require('seedrandom');
      const generator = seedrandom('hello');
      for (let i = 0; i < 5; i++) {
        player1.chooseAndAttackEnemyCell(player2.gameBoard, generator);
        player2.chooseAndAttackEnemyCell(player1.gameBoard, generator);
      }
      expect(
        board1.every((row, i) =>
          row.every((cell, j) => {
            if (
              (board1[i][j].isHitted === false &&
                board2[i][j].isHitted === true) ||
              (board1[i][j].isHitted === true &&
                board2[i][j].isHitted === false)
            ) {
              return false;
            }
            return true;
          })
        )
      ).toBeFalsy();
    });
  });
});
