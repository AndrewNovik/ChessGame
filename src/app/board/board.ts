import { MapType } from '@angular/compiler';
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
  SafeMoves,
} from '../interfaces/figures.interface';

export class ChessBoard {
  private chessBoard: (FigurePiece | null)[][];
  private _playerColor = Color.White;
  private readonly chessBoardSize: number = 8;
  private _safeCells: SafeMoves = new Map();

  constructor() {
    this.chessBoard = [
      [
        new Rook(Color.White),
        new Knight(Color.White),
        new Bishop(Color.White),
        new Queen(Color.White),
        new King(Color.White),
        new Bishop(Color.White),
        new Knight(Color.White),
        new Rook(Color.White),
      ],
      [
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        null,
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
      ],
      [
        new Knight(Color.White),
        new Knight(Color.White),
        null,
        null,
        null,
        null,
        null,
        new Knight(Color.White),
      ],
      [null, null, null, new Bishop(Color.White), null, null, null, null],
      [
        null,
        new Queen(Color.White),
        null,
        null,
        new Rook(Color.White),
        null,
        new King(Color.White),
        null,
      ],
      [null, null, null, new Bishop(Color.White), null, null, null, null],
      [
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
      ],
      [
        new Rook(Color.Black),
        new Knight(Color.Black),
        new Bishop(Color.Black),
        new Queen(Color.Black),
        new King(Color.Black),
        new Bishop(Color.Black),
        new Knight(Color.Black),
        new Rook(Color.Black),
      ],
    ];
    this._safeCells = this.findSafeMoves();
  }

  get safeCells() {
    return this._safeCells;
  }

  public get playerColor(): Color {
    return this._playerColor;
  }

  public get chessBoardView(): (Figure | null)[][] {
    return this.chessBoard.map((row) => {
      return row.map((piece) =>
        piece instanceof FigurePiece ? piece.figure : null
      );
    });
  }
  public static isCellDark(x: number, y: number): boolean {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
  }

  private areCoordsValid(x: number, y: number): boolean {
    return (
      x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize
    );
  }

  public isInCheck(playerFigureColor: Color): boolean {
    for (let x = 0; x < this.chessBoardSize; x++) {
      for (let y = 0; y < this.chessBoardSize; y++) {
        const figure: FigurePiece | null = this.chessBoard[x][y];
        if (!figure || figure.color === playerFigureColor) continue;

        for (const { x: dx, y: dy } of figure.coordinates) {
          let newX: number = x + dx;
          let newY: number = y + dy;

          if (!this.areCoordsValid(newX, newY)) continue;

          if (
            figure instanceof Pawn ||
            figure instanceof Knight ||
            figure instanceof King
          ) {
            if (figure instanceof Pawn && dy === 0) continue;

            const attackedFigure: FigurePiece | null =
              this.chessBoard[newX][newY];

            if (
              attackedFigure instanceof King &&
              attackedFigure.color == playerFigureColor
            ) {
              return false;
            }
          } else {
            while (this.areCoordsValid(newX, newY)) {
              const attackedFigure: FigurePiece | null =
                this.chessBoard[newX][newY];
              if (
                attackedFigure instanceof King &&
                attackedFigure.color === playerFigureColor
              )
                return true;

              if (attackedFigure !== null) break;

              newX += dx;
              newY += dy;
            }
          }
        }
      }
    }
    return false;
  }

  private isPositionSafeAfterMove(
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): boolean {
    const prevFigure: FigurePiece | null = this.chessBoard[prevX][prevY];
    if (!prevFigure) return false;

    const newFigure: FigurePiece | null = this.chessBoard[newX][newY];
    if (newFigure && newFigure.color === prevFigure.color) return false;

    this.chessBoard[prevX][prevY] = null;
    this.chessBoard[newX][newY] = prevFigure;

    const isPositionSafe: boolean = !this.isInCheck(prevFigure.color);

    this.chessBoard[prevX][prevY] = prevFigure;
    this.chessBoard[newX][newY] = newFigure;

    return isPositionSafe;
  }

  private findSafeMoves(): SafeMoves {
    const safeMoves: SafeMoves = new Map<string, Coordinate[]>();

    for (let x = 0; x < this.chessBoardSize; x++) {
      for (let y = 0; y < this.chessBoardSize; y++) {
        const figure: FigurePiece | null = this.chessBoard[x][y];

        if (!figure || figure.color !== this._playerColor) continue;

        const figureSafeMoves: Coordinate[] = [];

        for (const { x: dx, y: dy } of figure.coordinates) {
          let newX: number = x + dx;
          let newY: number = y + dy;

          if (!this.areCoordsValid(newX, newY)) continue;

          let newFigure: FigurePiece | null = this.chessBoard[newX][newY];

          if (newFigure && newFigure.color === figure.color) continue;

          if (figure instanceof Pawn) {
            if (dx == 2 || dx === -2) {
              if (newFigure) continue;
              if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
            }

            if ((dx === 1 || dx === -1) && dy === 0 && newFigure) continue;

            if (
              (dy === 1 || dy === -1) &&
              (!newFigure || figure.color === newFigure.color)
            )
              continue;
          }

          if (
            figure instanceof Pawn ||
            figure instanceof Knight ||
            figure instanceof King
          ) {
            if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
              figureSafeMoves.push({ x: newX, y: newY });
            }
          } else {
            while (this.areCoordsValid(newX, newY)) {
              newFigure = this.chessBoard[newX][newY];
              if (newFigure && newFigure.color === figure.color) break;

              if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                figureSafeMoves.push({ x: newX, y: newY });
              }
              if (newFigure !== null) break;

              newX += dx;
              newY += dy;
            }
          }
        }

        if (figureSafeMoves.length) {
          safeMoves.set(`${x},${y}`, figureSafeMoves);
        }
      }
    }
    return safeMoves;
  }
}
