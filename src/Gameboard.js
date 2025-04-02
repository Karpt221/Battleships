import { Ship } from './Ship.js';
import { Cell } from './Cell.js';

export class Gameboard {
  #board;
  #ships;
  #boardSize = 10;

  constructor() {
    this.#board = [];
    for (let i = 0; i < this.#boardSize; i++) {
      this.#board[i] = [];
      for (let j = 0; j < this.#boardSize; j++) {
        this.#board[i][j] = new Cell();
      }
    }
    this.#ships = [];
  }

  get board() {
    const boardCopy = [];
    for (let i = 0; i < this.#boardSize; i++) {
      boardCopy[i] = [];
      for (let j = 0; j < this.#boardSize; j++) {
        boardCopy[i][j] = this.#board[i][j];
      }
    }
    return boardCopy;
  }

  getCell(x, y) {
    if (x < 0 || x >= this.#boardSize || y < 0 || y >= this.#boardSize) {
      throw new Error('Can not get a ship in unavailable postion');
    }
    return this.#board[x][y];
  }

  #chooseCell(i, x, y, isVertical) {
    if (i === 0) {
      return this.getCell(x, y);
    } else if (isVertical) {
      return this.getCell(i, y);
    } else {
      return this.getCell(x, i);
    }
  }

  placeShip(ship, x, y, isVertical) {
    let cell = null;
    try {
      for (let i = 0; i < ship.length; i++) {
        cell = this.#chooseCell(i, x, y, isVertical);
        if (cell.shipRef !== null) {
          throw new Error('Can not place a ship in unavailable postion');
        }
      }
    } catch (error) {
      if (
        error.message === 'Can not place a ship in unavailable postion' ||
        error.message === 'Can not get a ship in unavailable postion'
      ) {
        throw new Error('Can not place a ship in unavailable postion');
      }
      throw error;
    }

    for (let i = 0; i < ship.length; i++) {
      cell = this.#chooseCell(i, x, y, isVertical);
      cell.setShipRef(ship);
      this.#ships.push(ship);
    }
  }

  receiveAttack(x, y) {
    try {
      const cell = this.getCell(x, y);
      if (cell.isHitted === true) {
        throw new Error('Can not hit unavailable postion');
      }
      cell.setIsHitted();
      if (cell.shipRef !== null) {
        cell.shipRef.hit();
      }
    } catch (error) {
      if (
        error.message === 'Can not get a ship in unavailable postion' ||
        error.message === 'Can not hit unavailable postion'
      ) {
        throw new Error('Can not hit unavailable postion');
      }
      throw error;
    }
  }

  isAllSunk() {
    return this.#ships.every((ship) => {
      if (ship.isSunk()) {
        return true;
      }
      return false;
    });
  }
}
