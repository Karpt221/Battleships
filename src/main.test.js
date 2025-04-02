import { Ship } from './Ship.js';

import { Cell } from './Cell.js';

import { Gameboard } from './Gameboard.js';

describe('Ship tests', () => {
  // test('Ship constructor creates a proper object', () => {
  //   const ship = new Ship(1);
  //   expect(ship.length).toBe(1);
  // });
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
    // test("Cell constructor creates a proper object",()=>{
    //   const cell = new Cell();
    //   expect(cell.shipRef).toBeNull();
    //   expect(cell.isHitted).toBe(false);
    // })

    test('shipRef setter throws an error when passing the wrong type value', () => {
      const cell = new Cell();
      expect(() => {
        cell.setShipRef('Wrong type');
      }).toThrow(Error);
      expect(() => {
        cell.setShipRef(1);
      }).toThrow(Error);
    });

    // test("shipRef setter sets ship properly",()=>{
    //   const cell = new Cell();
    //   const ship = new Ship(1);
    //   cell.setShipRef(ship)
    //   expect(cell.shipRef instanceof Ship).toBe(true);
    //   expect(cell.shipRef.length).toBe(1);
    // })

    // test("setIsHitted marks hitted cell properly", ()=>{
    //   const cell = new Cell();
    //   cell.setIsHitted()
    //   expect(cell.isHitted).toBe(true);
    // })
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

  test('2 cells Ship placed vertically from 0:0 to 1:0 on the board', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(2), 0, 0, true);
    expect(
      gameboard.board.every((row, i) =>
        row.every((cell, j) => {
          if (
            (['0:0', '1:0'].includes(`${i}:${j}`) &&
              gameboard.getCell(i, j).shipRef === null) ||
            (!['0:0', '1:0'].includes(`${i}:${j}`) &&
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
    }).toThrow('Can not place a ship in unavailable postion');
  });

  test('placeShip returns Error when placing Ship in position where another Ship already placed', () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(new Ship(4), 0, 0, false);
    expect(() => {
      gameboard.placeShip(new Ship(4), 0, 0, false);
    }).toThrow('Can not place a ship in unavailable postion');
  });

  test('receiveAttack marks Cell as hited and deals hit to a ship', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(1), 0, 0, false);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.getCell(0, 0).isHitted).toBeTruthy();
    expect(gameboard.getCell(0, 0).shipRef.isSunk()).toBeTruthy();
  });

  test('receiveAttack returns Error when hitting unavailable postion', () => {
    const gameboard = new Gameboard();
    expect(() => {
      gameboard.receiveAttack(100, 100);
    }).toThrow('Can not hit unavailable postion');
  });

  test('receiveAttack returns Error when hitting the same postion', () => {
    const gameboard = new Gameboard();
    gameboard.receiveAttack(0, 0);
    expect(() => {
      gameboard.receiveAttack(0, 0);
    }).toThrow('Can not hit unavailable postion');
  });

  test('isAllSunk returns proper message when all ships sunk',()=>{
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(1), 0, 0, false);
    expect(gameboard.isAllSunk()).toBeFalsy();
    gameboard.receiveAttack(0, 0);
    expect(gameboard.isAllSunk()).toBeTruthy();
  })
});
