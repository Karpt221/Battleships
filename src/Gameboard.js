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
      throw new Error('Can not get a cell in unavailable position');
    }
    return this.#board[x][y];
  }

  #chooseCoordinates(i, x, y, isVertical) {
    if (i === 0) {
      return [x, y];
    } else if (isVertical) {
      return [x + i, y];
    } else {
      return [x, y + i];
    }
  }

  #adjacentCellsAreEmpty(x, y) {
    let steps = [
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
    ];
    let cell;
    for (const step of steps) {
      let newX = x + step[0];
      let newY = y + step[1];
      if (newX >= 0 && newX < this.#boardSize && newY >= 0 && newY < this.#boardSize) {
        cell = this.getCell(newX, newY);
        if (cell.shipRef !== null) {
          return false;
        }
      }
    }
    return true;
  }

  placeShip(ship, x, y, isVertical) {
    let cell = null;
    try {
      for (let i = 0; i < ship.length; i++) {
        let [xi, yi] = this.#chooseCoordinates(i, x, y, isVertical);
        cell = this.getCell(xi, yi);
        if (cell.shipRef !== null || !this.#adjacentCellsAreEmpty(xi, yi)) {
          throw new Error('Can not place a ship in unavailable position');
        }
      }
    } catch (error) {
      if (
        error.message === 'Can not place a ship in unavailable position' ||
        error.message === 'Can not get a cell in unavailable position'
      ) {
        throw new Error('Can not place a ship in unavailable position');
      }
      throw error;
    }

    for (let i = 0; i < ship.length; i++) {
      let [xi, yi] = this.#chooseCoordinates(i, x, y, isVertical);
      cell = this.getCell(xi, yi);
      cell.setShipRef(ship);
      this.#ships.push(ship);
    }
  }

  receiveAttack(x, y) {
    try {
      const cell = this.getCell(x, y);
      if (cell.isHitted === true) {
        throw new Error('Can not hit unavailable position');
      }
      cell.setIsHitted();
      if (cell.shipRef !== null) {
        cell.shipRef.hit();
      }
    } catch (error) {
      if (
        error.message === 'Can not get a cell in unavailable position' ||
        error.message === 'Can not hit unavailable position'
      ) {
        throw new Error('Can not hit unavailable position');
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
