import { Bishop } from '../figures/bishop/bishop';
import { FigurePiece } from '../figures/figures';
import { King } from '../figures/king/king';
import { Knight } from '../figures/knight/knight';
import { Pawn } from '../figures/pawn/pawn';
import { Queen } from '../figures/queen/queen';
import { Rook } from '../figures/rook/rook';
import { Color, Figure, PiecesColor } from '../interfaces/figures.interface';

export class ChessBoard {
  private chessBoard: (FigurePiece | null)[][];
  private _playerColor = Color.White;

  constructor() {
    this.chessBoard = [
      [
        new Rook(PiecesColor.White),
        new Knight(PiecesColor.White),
        new Bishop(PiecesColor.White),
        new Queen(PiecesColor.White),
        new King(PiecesColor.White),
        new Bishop(PiecesColor.White),
        new Knight(PiecesColor.White),
        new Rook(PiecesColor.White),
      ],
      [
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
        new Pawn(PiecesColor.White),
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
        new Pawn(PiecesColor.Black),
      ],
      [
        new Rook(PiecesColor.Black),
        new Knight(PiecesColor.Black),
        new Bishop(PiecesColor.Black),
        new Queen(PiecesColor.Black),
        new King(PiecesColor.Black),
        new Bishop(PiecesColor.Black),
        new Knight(PiecesColor.Black),
        new Rook(PiecesColor.Black),
      ],
    ];
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
}
