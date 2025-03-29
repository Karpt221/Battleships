export class Ship {
  #hitCount = 0;
  #length;

  constructor(length) {
    if(length < 1 || length > 4){
      throw new Error("Ship length should be between 1 an 4");
    }
    this.#length = length;
  }

  get length(){
    return this.#length;
  }

  hit(){
    this.#hitCount++;
  }

  isSunk(){
    if(this.#hitCount >= this.#length){
      return true;
    }
    return false;
  }
}
