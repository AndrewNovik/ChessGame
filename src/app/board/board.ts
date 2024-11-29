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
  KingChecking,
  LastMove,
  SafeMoves,
} from '../interfaces/figures.interface';
import { startBoardPosition } from './board.const';

export class ChessBoard {
  private _playerColor: Color = Color.White;
  private readonly chessBoardSize: number = 8;

  private chessBoard: (FigurePiece | null)[][] = startBoardPosition;
  private _safeCells: SafeMoves = this.findSafeMoves(); // Map<string, Coordinate[]>
  private _checkingKing: KingChecking = { isInCheck: false }; // {isInCheck: boolean; x: number; y: number;} default start king is no checked
  private _lastMove: LastMove | undefined;

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

  public moveFigure(prevX: number, prevY: number, newX: number, newY: number) {
    // не выпрыгиваем за пределы доски
    if (!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(newX, newY))
      return;

    const allyFigure: FigurePiece | null = this.chessBoardFigures[prevX][prevY];

    // перепроверка, если на выьранном поле не фигуры или она вражеская
    if (!allyFigure || allyFigure.color !== this._playerColor) return;

    // выборка у нашей фигуры ее доступных ходов
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

    // запись прошлого хода
    this._lastMove = {
      piece: allyFigure,
      prevX: prevX,
      prevY: prevY,
      currX: newX,
      currY: newY,
    };

    this.chessBoard[prevX][prevY] = null;
    this.chessBoard[newX][newY] = allyFigure;

    // меняем активного игрока
    this._playerColor =
      this._playerColor === Color.White ? Color.Black : Color.White;

    // обязательно считаем король под шахом или нет, т.к. ход сделан и если что, помечаем его
    this.isInCheck(this._playerColor, true);

    // пересчитываем доступные ходы
    this._safeCells = this.findSafeMoves();
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
}
