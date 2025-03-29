import { Ship } from './Ship.js';

export class Cell {
  #isHitted;
  #shipRef;

  constructor() {
    this.#isHitted = false;
    this.#shipRef = null;
  }
  get isHitted() {
    return this.#isHitted;
  }
  get shipRef() {
    return this.#shipRef;
  }

  setShipRef(ship) {
    if (!(ship instanceof Ship)) {
      throw new Error('setShipRef argument should be type of Ship');
    }
    this.#shipRef = ship;
  }

  setIsHitted() {
    this.#isHitted = true;
  }
}

export class Gameboard {
  constructor() {
    
  }
}
