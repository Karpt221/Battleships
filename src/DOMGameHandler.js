import { Player, RobotPlayer } from './Player.js';

export class DOMGameHandler {
  constructor() {
    this.humanPlayer = new Player();
    this.robotPlayer = new RobotPlayer();
    this.winnerExist = false;
    this.DOMRobotBoard = document.querySelector('#robot-board');
    this.DOMHumanBoard = document.querySelector('#human-board');
    this.DOMWinMessage = document.querySelector('.win-mesasge');
    this.DOMStartBtn = document.querySelector('#start-btn');
    this.DOMPositionBtn = document.querySelector('#position-btn');
    this.realPlayerTurnHandler = this.realPlayerTurnHandler.bind(this);
    this.robotPlayerTurnHadler = this.robotPlayerTurnHadler.bind(this);
    this.robotTurnEvent = new Event('robotTurn');
  }

  blockRobotsGrid(player) {}

  realPlayerTurnHandler(event) {
    const targetCell = event.target;
    const cellCoordinates = targetCell.dataset.coordinate;
    const [x, y] = [
      Number(cellCoordinates.at(0)),
      Number(cellCoordinates.at(2)),
    ];
    const robotBoard = this.robotPlayer.gameBoard.board;
    if (robotBoard[x][y].isHitted) {
      return;
    }

    this.humanPlayer.attackEnemyCell(this.robotPlayer.gameBoard, x, y);
    if (
      robotBoard[x][y].shipRef !== null &&
      this.robotPlayer.gameBoard.isAllSunk()
    ) {
      this.removeListeners();
      this.DOMPositionBtn.classList.remove('hide');
      this.DOMStartBtn.classList.remove('hide');
      this.DOMWinMessage.textContent = 'Human is winner';
      this.winnerExist = true;
    }

    this.renderBoard(this.robotPlayer.gameBoard.board, false);
    setTimeout(() => {
      this.DOMHumanBoard.dispatchEvent(this.robotTurnEvent);
    }, '1000');
  }

  robotPlayerTurnHadler(event) {
    const [x, y] = this.robotPlayer.chooseAndAttackEnemyCell(
      this.humanPlayer.gameBoard,
      Math.random
    );

    if (
      this.humanPlayer.gameBoard.board[x][y].shipRef !== null &&
      this.humanPlayer.gameBoard.isAllSunk()
    ) {
      this.removeListeners();
      this.DOMPositionBtn.classList.remove('hide');
      this.DOMStartBtn.classList.remove('hide');
      this.DOMWinMessage.textContent = 'Robot is winner';
      this.winnerExist = true;
    }
    this.renderBoard(this.humanPlayer.gameBoard.board, true);
  }

  removeListeners() {
    this.DOMHumanBoard.removeEventListener(
      'robotTurn',
      this.robotPlayerTurnHadler
    );

    this.DOMRobotBoard.removeEventListener('click', this.realPlayerTurnHandler);
  }

  initializeGame() {
    this.robotPlayer.placeShipsRandomly(Math.random);

    this.renderBoard(this.humanPlayer.gameBoard.board, true);
    this.renderBoard(this.robotPlayer.gameBoard.board, false);

    this.DOMPositionBtn.addEventListener('click', () => {
      this.humanPlayer.gameBoard.cleanBoard();
      this.humanPlayer.placeShipsRandomly(Math.random);
      this.renderBoard(this.humanPlayer.gameBoard.board, true);
    });

    this.DOMStartBtn.addEventListener('click', () => {
      if (this.humanPlayer.gameBoard.isEmpty() || this.winnerExist) {
        this.humanPlayer.gameBoard.cleanBoard();
        this.humanPlayer.placeShipsRandomly(Math.random);
        this.renderBoard(this.humanPlayer.gameBoard.board, true);
      }

      this.robotPlayer.gameBoard.cleanBoard();
      this.robotPlayer.placeShipsRandomly(Math.random);
      this.renderBoard(this.robotPlayer.gameBoard.board, false);

      this.DOMRobotBoard.addEventListener('click', this.realPlayerTurnHandler);
      this.DOMHumanBoard.addEventListener(
        'robotTurn',
        this.robotPlayerTurnHadler
      );
      this.DOMPositionBtn.classList.add('hide');
      this.DOMStartBtn.classList.add('hide');
      this.winnerExist = false;
    });
  }

  renderBoard(board, isHuman) {
    let domBoard;
    if (isHuman) {
      domBoard = document.querySelector('#human-board');
    } else {
      domBoard = document.querySelector('#robot-board');
    }

    domBoard.innerHTML = '';

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-coordinate', `${i}:${j}`);
        if (board[i][j].shipRef !== null && isHuman) {
          cell.classList.add('visible-ship');
        }
        if (board[i][j].isHitted && board[i][j].shipRef !== null) {
          cell.textContent = '✕';
        } else if (board[i][j].isHitted) {
          cell.textContent = '•';
        }
        domBoard.appendChild(cell);
      }
    }
  }
}
