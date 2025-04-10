import { Gameboard } from './Gameboard.js';
import { Ship } from './Ship.js';

export class Player {
  #gameBoard;

  constructor() {
    this.#gameBoard = new Gameboard();
  }

  get gameBoard() {
    return this.#gameBoard;
  }

  _getRandomInt(max, generator) {
    return Math.floor(generator() * max);
  }

  placeShipsRandomly(generator = Math.random) {
    let x;
    let y;
    let isVertical;
    const direction = [false, true];
    let isPlaced;
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

    for (const ship of ships) {
      isPlaced = false;
      while (!isPlaced) {
        try {
          x = this._getRandomInt(10, generator);
          y = this._getRandomInt(10, generator);
          isVertical = direction[this._getRandomInt(2, generator)];
          this.#gameBoard.placeShip(ship, x, y, isVertical);
          isPlaced = true;
        } catch (error) {
          if (
            error.message === 'Can not place a ship in unavailable position'
          ) {
            continue;
          }
          throw error;
        }
      }
    }
  }

  attackEnemyCell(enemyGameBoard, x, y) {
    try {
      enemyGameBoard.receiveAttack(x, y);
    } catch (error) {
      if (error.message === 'Can not hit unavailable position') {
        return;
      }
      throw error;
    }
  }
}

export class RobotPlayer extends Player {
  constructor() {
    super();
  }
  chooseAndAttackEnemyCell(enemyGameBoard, generator = Math.random) {
    const enemyBoard = enemyGameBoard.board;
    let x;
    let y;
    let attacked = false;
    while (!attacked) {
      x = super._getRandomInt(10, generator);
      y = super._getRandomInt(10, generator);
      if (!enemyBoard[x][y].isHitted) {
        enemyGameBoard.receiveAttack(x, y);
        attacked = true;
      }
    }
    return [x, y];
  }
}
