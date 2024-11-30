import { Bishop } from '../figures/bishop/bishop';
import { FigurePiece } from '../figures/figures';
import { King } from '../figures/king/king';
import { Knight } from '../figures/knight/knight';
import { Pawn } from '../figures/pawn/pawn';
import { Queen } from '../figures/queen/queen';
import { Rook } from '../figures/rook/rook';
import {
  Color,
  Coordinate,
  Figure,
  KingChecking,
  LastMove,
  SafeMoves,
} from '../interfaces/figures.interface';
import { startBoardPosition } from './board.const';
import cloneDeep from 'lodash/cloneDeep';

export class ChessBoard {
  private _playerColor: Color = Color.White;
  private readonly chessBoardSize: number = 8;
  // копирование стартовой позиции с экземплярами классов фигур в доску
  private chessBoard: (FigurePiece | null)[][] = cloneDeep(startBoardPosition);

  private _safeCells: SafeMoves = this.findSafeMoves(); // Map<string, Coordinate[]>
  private _checkingKing: KingChecking = { isInCheck: false }; // {isInCheck: boolean; x: number; y: number;} default start king is no checked
  private _lastMove: LastMove | undefined;

  private _isGameOver: boolean = false;
  private _gameOverMessage: string | undefined;
  private fiftyMoveRuleCounter: number = 0;

  get safeCells(): SafeMoves {
    return this._safeCells;
  }

  get playerColor(): Color {
    return this._playerColor;
  }

  get checkingKing(): KingChecking {
    return this._checkingKing;
  }

  get lastMove(): LastMove | undefined {
    return this._lastMove;
  }

  get isGameOver(): boolean {
    return this._isGameOver;
  }

  get gameOverMessage(): string | undefined {
    return this._gameOverMessage;
  }

  // доска в формате массивов из обьектов фигур, null и тд.
  get chessBoardFigures(): (FigurePiece | null)[][] {
    return this.chessBoard.map((row) => {
      return row.map((cell) => (cell?.figure ? cell : null));
    });
  }

  // метод который используется во вью для чередования темных и светлых клеток
  static isCellDark(x: number, y: number): boolean {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
  }

  // координаты должны быть в пределах от 0 до 8
  private areCoordsValid(x: number, y: number): boolean {
    return (
      x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize
    );
  }

  public isInCheck(
    playerFigureColor: Color,
    checkCurrPos: boolean = false
  ): boolean {
    for (let x = 0; x < this.chessBoardSize; x++) {
      for (let y = 0; y < this.chessBoardSize; y++) {
        const figure: FigurePiece | null = this.chessBoard[x][y];

        // если нет фигуры на клетке или фигура нашего цвета, скипаем итерацию
        if (!figure || figure.color === playerFigureColor) continue;

        // пробегаемся по дирекшенам вражеской фигуры
        for (const { x: dx, y: dy } of figure.figureDirections) {
          let newX: number = x + dx;
          let newY: number = y + dy;

          // если дирекшен вывалился за пределы доски, скипаем итерацию
          if (!this.areCoordsValid(newX, newY)) continue;

          if (
            figure instanceof Pawn ||
            figure instanceof Knight ||
            figure instanceof King
          ) {
            // обьявляем атакуемую фигуру
            const attackedFigure: FigurePiece | null =
              this.chessBoard[newX][newY];

            // пешка по вертикали шах не дает, выходим из итерации такого дирекшена
            if (figure instanceof Pawn && dy === 0) continue;

            if (
              attackedFigure instanceof King &&
              attackedFigure.color == playerFigureColor
            ) {
              if (checkCurrPos)
                this._checkingKing = { isInCheck: true, x: newX, y: newY };

              return true;
            }
          } else {
            while (this.areCoordsValid(newX, newY)) {
              const attackedFigure: FigurePiece | null =
                this.chessBoard[newX][newY];
              if (
                attackedFigure instanceof King &&
                attackedFigure.color === playerFigureColor
              ) {
                // очень часто вызывается функция, но засетить, что король под шахом нужно не всегда
                if (checkCurrPos)
                  this._checkingKing = { isInCheck: true, x: newX, y: newY };

                return true;
              }

              if (attackedFigure) break;

              newX += dx;
              newY += dy;
            }
          }
        }
      }
    }

    // если функция дошла сюда, то король не под шахом
    if (checkCurrPos) this._checkingKing = { isInCheck: false };
    return false;
  }

  // проверка на возможность будущего хода
  private isPositionSafeAfterMove(
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): boolean {
    const startFigure: FigurePiece | null = this.chessBoard[prevX][prevY];
    if (!startFigure) return false;

    const potencialFigure: FigurePiece | null = this.chessBoard[newX][newY];
    if (potencialFigure && potencialFigure.color === startFigure.color)
      return false;

    // эмулируем позицию, словно уже походили и проверяем будет ли шах
    this.chessBoard[prevX][prevY] = null;
    this.chessBoard[newX][newY] = startFigure;

    // считать что король под шахом не нужно, т.к. это эмуляция хода
    const isPositionSafe: boolean = !this.isInCheck(startFigure.color, false);

    // не забываем вернуть позицию обратно
    this.chessBoard[prevX][prevY] = startFigure;
    this.chessBoard[newX][newY] = potencialFigure;

    return isPositionSafe;
  }

  // все доступные ходы для всех фигур
  private findSafeMoves(): SafeMoves {
    const safeMoves: SafeMoves = new Map<string, Coordinate[]>();

    for (let x = 0; x < this.chessBoardSize; x++) {
      for (let y = 0; y < this.chessBoardSize; y++) {
        const startFigure: FigurePiece | null = this.chessBoard[x][y];
        const figureSafeMoves: Coordinate[] = [];

        // если есть фигура цвета игрока
        if (startFigure) {
          if (startFigure.color === this._playerColor) {
            // нужно пройтись по его дирекшенам (у ладьи их 4 например)
            for (const { x: dx, y: dy } of startFigure.figureDirections) {
              // обьявляем новую координату для проверки исходя из дирекшена
              let newX: number = x + dx;
              let newY: number = y + dy;

              // есть ли новое поле в рамках игровой доски
              if (this.areCoordsValid(newX, newY)) {
                // проверяем есть ли фигура на клетке исходя из дирекшена
                let possibleFigure: FigurePiece | null =
                  this.chessBoard[newX][newY];

                if (startFigure instanceof Pawn) {
                  // проверки на возможные ходы пешкам. Будем выходить из текущей итеарации цикла добавления новой коордитаны каждый раз когда заходим в условие ниже
                  if (
                    ((dx == 2 || dx === -2) && dy === 0 && possibleFigure) || // мув на две клетки
                    ((dx === 1 || dx === -1) && dy === 0 && possibleFigure) || // мув на одну
                    ((dy === 1 || dy === -1) && !possibleFigure) || // мув на пустую клетку по диагонали
                    ((dy === 1 || dy === -1) &&
                      possibleFigure?.color === startFigure.color) // мув на союзную клетку по диаганали
                  )
                    continue;
                  // если в пешку не упирается другая фигура по вертикали или по диогонали стоит вражеская пешка, значит запишем возможный ход
                  if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                    figureSafeMoves.push({ x: newX, y: newY });
                  }
                }

                // если там ничего не стоит или стоит вражеская фигура (чтобы побить)
                if (
                  !possibleFigure ||
                  possibleFigure.color !== startFigure.color
                ) {
                  // королю и коню самый простой рассчет ходов
                  if (
                    startFigure instanceof Knight ||
                    startFigure instanceof King
                  ) {
                    if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                      figureSafeMoves.push({ x: newX, y: newY });
                    }
                    // ладье, ферзю и слону рассчет возможных ходов пока итереируется дирекшен
                  } else if (
                    startFigure instanceof Queen ||
                    startFigure instanceof Rook ||
                    startFigure instanceof Bishop
                  ) {
                    while (this.areCoordsValid(newX, newY)) {
                      possibleFigure = this.chessBoard[newX][newY];
                      if (
                        possibleFigure &&
                        possibleFigure.color === startFigure!.color
                      )
                        // обязательный выход из цикла, если на потенциальной клетке есть союзная фигура
                        break;

                      if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                        figureSafeMoves.push({ x: newX, y: newY });
                      }
                      // обязательный выход из цикла, если на потенциальной клетке есть вражеская фигура
                      if (possibleFigure) break;

                      newX += dx;
                      newY += dy;
                    }
                  }
                }
              }
            }

            // добавление хода рокировки, если она возможна
            if (startFigure instanceof King) {
              // добавить O-O
              if (this.canCastle(startFigure, true)) {
                figureSafeMoves.push({ x, y: 6 });
              }
              // добавить O-O-O
              if (this.canCastle(startFigure, false)) {
                figureSafeMoves.push({ x, y: 2 });
              }
            }

            // добавление взятия на проходе если возможно
            if (
              startFigure instanceof Pawn &&
              this.canEnpassant(startFigure, x, y)
            ) {
              // добавляем доступный ход за вражеской пешкой (на 1 по вертикали в зависимости от цвета и в сторону пешки врага)
              figureSafeMoves.push({
                x: x + (startFigure.color === Color.White ? 1 : -1),
                y: this._lastMove!.prevY,
              });
            }
          }

          if (figureSafeMoves.length) {
            safeMoves.set(x + ',' + y, figureSafeMoves);
          }
        }
      }
    }
    return safeMoves;
  }

  public moveFigure(
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    promotedFigure: Figure | null
  ): void {
    if (this.isGameOver) return;
    // не выпрыгиваем за пределы доски
    if (!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(newX, newY))
      return;

    const allyFigure: FigurePiece | null = this.chessBoardFigures[prevX][prevY];

    // перепроверка, если на выбранном поле не фигуры или она вражеская
    if (!allyFigure || allyFigure.color !== this._playerColor) return;

    // выборка у нашей фигуры её доступных ходов
    const figureSafeMoves: Coordinate[] | undefined = this._safeCells.get(
      prevX + ',' + prevY
    );

    // проверяем есть ли в этой выборке выбранный ход
    if (
      !figureSafeMoves ||
      !figureSafeMoves.find(
        (coordinate) => coordinate.x === newX && coordinate.y === newY
      )
    ) {
      throw new Error('Square is not safe');
    }

    if (allyFigure instanceof King && !allyFigure.hasMoved) {
      // выполняем рокировку (по возможности, внутри есть проверка и до этого тоже была проверка, при добавлении возможного хода)
      //Не забываем, что перемещается именно король. В спец ходе переместится только ладья
      this.specialRookMove(prevX, prevY, newY);
      // сетим королю что он походил, если он еще не ходил
      allyFigure.hasMoved = true;
    }

    // правило 50 ходов, в котором если не сбили ни одной фигиры и не походили пешкой ни разу ведет к ничьей
    const isFigureTaken: boolean = this.chessBoard[newX][newY] !== null;

    if (allyFigure instanceof Pawn || isFigureTaken) {
      // обнуляем счетчик
      this.fiftyMoveRuleCounter = 0;
    } else {
      // ведем счет ходов без взятий и движений пешек
      this.fiftyMoveRuleCounter += 0.5;
    }

    if (
      allyFigure instanceof Pawn &&
      this._lastMove &&
      this._lastMove.piece instanceof Pawn &&
      Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 && // если пешка ходила на 2 поля вперед
      prevX == this._lastMove.currX && // если они стояли на одной горизонтали
      newY === this._lastMove.currY // если новая позиция по вертикали нашей пешки совпадает с вертикалью пешки врага
    ) {
      // значит случилось именно взятие на проходе и мы выполняем
      // специальный ход, в котором кроме нашей передвинутой пешки нужно сбить и пешку врага. Проверка на шах уже была раньше.
      this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
    }

    if (
      (allyFigure instanceof Pawn || allyFigure instanceof Rook) &&
      !allyFigure.hasMoved
    ) {
      // пешке, ладье сетим, что они уже ходили, если они еще не ходили
      allyFigure.hasMoved = true;
    }

    // если параметром передалось превращение
    if (promotedFigure) {
      this.chessBoard[newX][newY] = this.promotedFigure(promotedFigure);
    } else {
      this.chessBoard[newX][newY] = allyFigure;
    }

    this.chessBoard[prevX][prevY] = null;

    // запись прошлого хода
    this._lastMove = {
      piece: allyFigure,
      prevX: prevX,
      prevY: prevY,
      currX: newX,
      currY: newY,
    };

    // меняем активного игрока
    this._playerColor =
      this._playerColor === Color.White ? Color.Black : Color.White;

    // обязательно считаем король под шахом или нет, т.к. ход сделан и если что, помечаем его
    this.isInCheck(this._playerColor, true);

    // пересчитываем доступные ходы
    this._safeCells = this.findSafeMoves();

    // проверяем не закончилась ли игра
    this._isGameOver = this.isGameFinished();
  }

  private canCastle(king: King, kingShortSideCastle: boolean): boolean {
    if (king.hasMoved) return false;

    // позиции фигур в зависимости от цвета короля
    const kingPositionX: number = king.color === Color.White ? 0 : 7;
    const kingPositionY: number = 4;
    const rookPositionX: number = kingPositionX;
    const rookPositionY: number = kingShortSideCastle ? 7 : 0;

    const rook: FigurePiece | null =
      this.chessBoard[rookPositionX][rookPositionY];
    // добавить проверку чтобы король небыл под шахом
    // если ладьи нет на месте или она уже ходила, то рокировка не возможна в эту сторону
    if (!(rook instanceof Rook) || rook.hasMoved) return false;

    // два потенциальных хода короля по игрику во время рокировки, мало ли там шах бдует
    const firstShortSideKingPositionY: number =
      kingPositionY + (kingShortSideCastle ? 1 : -1);
    const secondShortSideKingPositionY: number =
      kingPositionY + (kingShortSideCastle ? 2 : -2);

    // проверяем нет ли на этих клетках других фигур
    if (
      this.chessBoard[kingPositionX][firstShortSideKingPositionY] ||
      this.chessBoard[kingPositionX][secondShortSideKingPositionY]
    )
      return false;

    // проверка на то, что стоит ли что-то на позиции коней (A1 или H1) на длинной стороне рокировки
    if (!kingShortSideCastle && this.chessBoard[kingPositionX][1]) return false;

    // выводим результат: будет ли данный ход безопасным, учитываю оба хода в нужную сторону
    return (
      this.isPositionSafeAfterMove(
        kingPositionX,
        kingPositionY,
        kingPositionX,
        firstShortSideKingPositionY
      ) &&
      this.isPositionSafeAfterMove(
        kingPositionX,
        kingPositionY,
        kingPositionX,
        secondShortSideKingPositionY
      )
    );
  }

  private specialRookMove(prevX: number, prevY: number, newY: number): void {
    // проверка, передвигаем ли мы короля на 2 клетки влево или вправо (делаем ли мы ход рокировки)
    if (Math.abs(newY - prevY) === 2) {
      // позиция ладьи по иксу равна позиции короля
      const rookPositionX: number = prevX;
      // выбор ладьи происходит за счет того, в какую сторону происходит рокировка
      const rookPositionY: number = newY > prevY ? 7 : 0;

      const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
      // аналогичной логикой выбирается поле для рокировки
      const rookNewPositionY: number = newY > prevY ? 5 : 3;

      // выполняем перемещение и сетим, что ладья уже ходила
      this.chessBoard[rookPositionX][rookPositionY] = null;
      this.chessBoard[rookPositionX][rookNewPositionY] = rook;
      rook.hasMoved = true;
    }
  }

  private canEnpassant(pawn: Pawn, pawnX: number, pawnY: number): boolean {
    if (!this._lastMove) return false;
    const { piece, prevX, prevY, currX, currY } = this._lastMove;

    // если прошлого хода не существует или на прошлом ходу ходила не пешка,
    // или ходила пешка но не на 2 клетки вперед, или они стоят сейчас не на одной горизонтали
    // или они не стоят рядом по оси игрик
    if (
      !(piece instanceof Pawn) ||
      pawn.color !== this._playerColor ||
      Math.abs(currX - prevX) !== 2 ||
      pawnX !== currX ||
      Math.abs(pawnY - currY) !== 1
    )
      return false;

    // представляем, что передвигаем нашу пешку за вражескую пешку
    const pawnNewPositionX: number =
      pawnX + (pawn.color === Color.White ? 1 : -1);
    const pawnNewPositionY: number = currY;

    // проверяем не привело ли это к шаху, если сбили пешку и передвинули нашу
    this.chessBoard[currX][currY] = null;
    const isPositionSafeAfterMove: boolean = this.isPositionSafeAfterMove(
      pawnX,
      pawnY,
      pawnNewPositionX,
      pawnNewPositionY
    );
    // не забыли вернуть вражескую пешку обратно
    this.chessBoard[currX][currY] = piece;

    return isPositionSafeAfterMove;
  }

  // функция которая создаст экземпляр нужной, выбранной фигуры
  private promotedFigure(
    promotedFigureType: Figure
  ): Knight | Rook | Bishop | Queen {
    if (
      promotedFigureType === Figure.WhiteKnight ||
      promotedFigureType === Figure.BlackKnight
    )
      return new Knight(this._playerColor);
    if (
      promotedFigureType === Figure.WhiteBishop ||
      promotedFigureType === Figure.BlackBishop
    )
      return new Bishop(this._playerColor);
    if (
      promotedFigureType === Figure.WhiteRook ||
      promotedFigureType === Figure.BlackRook
    )
      return new Rook(this._playerColor);

    return new Queen(this._playerColor);
  }

  private isGameFinished(): boolean {
    // теоритически ничейные позиции при отстутствии материал для мата
    if (this.insufficientMaterial()) {
      this._gameOverMessage = 'Draw due to lack of material';
      return true;
    }

    // нет доступных ходов
    if (!this._safeCells.size) {
      if (this._checkingKing.isInCheck) {
        // мат
        const prevPlayer: string =
          this._playerColor === Color.White ? Color.Black : Color.White;
        this._gameOverMessage = prevPlayer + ' ' + 'won by checkmate';
      } else this._gameOverMessage = 'Stalemate'; // пат

      return true;
    }

    // правило 50 ходов
    if (this.fiftyMoveRuleCounter === 50) {
      this._gameOverMessage = 'Draw due fifty move rule';
      return true;
    }

    return false;
  }

  // недостаток материала для продолжения / ничья
  private insufficientMaterial(): boolean {
    const whitePieces: { piece: FigurePiece; x: number; y: number }[] = [];
    const blackPieces: { piece: FigurePiece; x: number; y: number }[] = [];

    for (let x = 0; x < this.chessBoardSize; x++) {
      for (let y = 0; y < this.chessBoardSize; y++) {
        const piece: FigurePiece | null = this.chessBoard[x][y];
        if (!piece) continue;

        if (piece.color === Color.White) whitePieces.push({ piece, x, y });
        else blackPieces.push({ piece, x, y });
      }
    }

    if (whitePieces.length === 1 && blackPieces.length === 1) return true;

    if (whitePieces.length === 1 && blackPieces.length === 2)
      return blackPieces.some(
        (piece) =>
          piece.piece instanceof Knight || piece.piece instanceof Bishop
      );
    else if (whitePieces.length === 2 && blackPieces.length === 1)
      return whitePieces.some(
        (piece) =>
          piece.piece instanceof Knight || piece.piece instanceof Bishop
      );
    else if (whitePieces.length === 2 && blackPieces.length === 2) {
      const whiteBishop = whitePieces.find(
        (piece) => piece.piece instanceof Bishop
      );
      const blackBishop = blackPieces.find(
        (piece) => piece.piece instanceof Bishop
      );

      if (whiteBishop && blackBishop) {
        const areBishopsOfSameColor: boolean =
          (ChessBoard.isCellDark(whiteBishop.x, whiteBishop.y) &&
            ChessBoard.isCellDark(blackBishop.x, blackBishop.y)) ||
          (!ChessBoard.isCellDark(whiteBishop.x, whiteBishop.y) &&
            !ChessBoard.isCellDark(blackBishop.x, blackBishop.y));

        return areBishopsOfSameColor;
      }
    }

    if (
      (whitePieces.length === 3 &&
        blackPieces.length === 1 &&
        this.playerHasOnlyTwoKnightsAndKing(whitePieces)) ||
      (whitePieces.length === 1 &&
        blackPieces.length === 3 &&
        this.playerHasOnlyTwoKnightsAndKing(blackPieces))
    )
      return true;

    if (
      (whitePieces.length >= 3 &&
        blackPieces.length === 1 &&
        this.playerHasOnlyBishopsWithSameColorAndKing(whitePieces)) ||
      (whitePieces.length === 1 &&
        blackPieces.length >= 3 &&
        this.playerHasOnlyBishopsWithSameColorAndKing(blackPieces))
    )
      return true;

    return false;
  }

  private playerHasOnlyTwoKnightsAndKing(
    pieces: { piece: FigurePiece; x: number; y: number }[]
  ): boolean {
    return pieces.filter((piece) => piece.piece instanceof Knight).length === 2;
  }

  private playerHasOnlyBishopsWithSameColorAndKing(
    pieces: { piece: FigurePiece; x: number; y: number }[]
  ): boolean {
    const bishops = pieces.filter((piece) => piece.piece instanceof Bishop);
    const areAllBishopsOfSameColor =
      new Set(
        bishops.map((bishop) => ChessBoard.isCellDark(bishop.x, bishop.y))
      ).size === 1;
    return bishops.length === pieces.length - 1 && areAllBishopsOfSameColor;
  }

  public restartGame() {
    // ресет игры
    this.fiftyMoveRuleCounter = 0;
    this._lastMove = undefined;
    this._isGameOver = false;
    this._checkingKing.isInCheck = false;
    this._gameOverMessage = undefined;
    this._playerColor = Color.White;
    this.chessBoard = cloneDeep(startBoardPosition);
    this._safeCells = this.findSafeMoves();
  }
}
