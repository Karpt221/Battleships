import { Ship } from './Ship.js';

import { Cell } from "./Gameboard.js";

describe('Ship tests', () => {
  test('Ship constructor creates a proper object', () => {
    const ship = new Ship(1);
    expect(ship.length).toBe(1);
  });
  test('Ship constructor throws an error when passing length less than 1 or higher than 4', () => {
    const ship = new Ship(1);
    expect(()=>{new Ship(0)}).toThrow(Error);
    expect(()=>{new Ship(5)}).toThrow(Error);
  });
  test('Ship properly defines when it is sunk', () => {
    const ship = new Ship(1);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe('Gameboard tests',()=>{
  describe('Cell tests',()=>{
    
    test("Cell constructor creates a proper object",()=>{
      const cell = new Cell();
      expect(cell.shipRef).toBeNull();
      expect(cell.isHitted).toBe(false);
    })

    test("shipRef setter throws an error when passing the wrong type value",()=>{
      const cell = new Cell();
      expect(()=> {cell.setShipRef("Wrong type")}).toThrow(Error);
      expect(()=> {cell.setShipRef(1)}).toThrow(Error);
    })

    test("shipRef setter sets ship properly",()=>{
      const cell = new Cell();
      const ship = new Ship(1);
      cell.setShipRef(ship)
      expect(cell.shipRef instanceof Ship).toBe(true);
      expect(cell.shipRef.length).toBe(1);
    })

    test("setIsHitted marks hitted cell properly", ()=>{
      const cell = new Cell();
      cell.setIsHitted()
      expect(cell.isHitted).toBe(true);
    })
  });
});