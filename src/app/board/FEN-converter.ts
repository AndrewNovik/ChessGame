import { FigurePiece } from '../figures/figures';
import { King } from '../figures/king/king';
import { Pawn } from '../figures/pawn/pawn';
import { Rook } from '../figures/rook/rook';
import { Color, LastMove } from '../interfaces/figures.interface';
import { columns } from './board.const';

export class FENconvertor {
  convertBoardToFEN(
    board: (FigurePiece | null)[][],
    playerColor: Color,
    lastMove: LastMove | undefined,
    fiftyMoveRuleCounter: number,
    fullMovesCounter: number
  ): string {
    let FEN = '';

    for (let i = 7; i >= 0; i--) {
      let FENrow: string = '';
      let consecutiveEmptyCellCounter = 0;
      for (const piece of board[i]) {
        if (!piece) {
          consecutiveEmptyCellCounter++;
          continue;
        }

        if (consecutiveEmptyCellCounter !== 0)
          FENrow += String(consecutiveEmptyCellCounter);

        consecutiveEmptyCellCounter = 0;
        FENrow += piece.figure;
      }

      if (consecutiveEmptyCellCounter !== 0)
        FENrow += String(consecutiveEmptyCellCounter);

      FEN += i === 0 ? FENrow : FENrow + '/';
    }

    const player: string = playerColor === Color.White ? 'w' : 'b';
    FEN += ' ' + player;
    FEN += ' ' + this.canCastling(board);
    FEN += ' ' + this.canEnPassant(lastMove, playerColor);
    FEN += ' ' + fiftyMoveRuleCounter * 2;
    FEN += ' ' + fullMovesCounter;
    return FEN;
  }

  private canCastling(board: (FigurePiece | null)[][]): string {
    const castlePossibilities = (color: Color): string => {
      let castlePossibility: string = '';

      const kingPositionX: number = color === Color.White ? 0 : 7;
      const king: FigurePiece | null = board[kingPositionX][4];

      if (king instanceof King && !king.hasMoved) {
        const rookPositionX: number = kingPositionX;
        const kingSideRook = board[rookPositionX][7];
        const queenSideRook = board[rookPositionX][0];

        if (kingSideRook instanceof Rook && !kingSideRook.hasMoved) {
          castlePossibility += color === Color.White ? 'K' : 'k';
        }

        if (queenSideRook instanceof Rook && !queenSideRook.hasMoved) {
          castlePossibility += color === Color.White ? 'Q' : 'q';
        }
      }
      return castlePossibility;
    };

    const canCastling: string =
      castlePossibilities(Color.White) + castlePossibilities(Color.Black);
    return canCastling !== '' ? canCastling : '-';
  }

  private canEnPassant(lastMove: LastMove | undefined, color: Color): string {
    if (!lastMove) return '-';
    const { piece, prevX, prevY, currX, currY } = lastMove;

    if (piece instanceof Pawn && Math.abs(currX - prevX) === 2) {
      const row: number = color === Color.White ? 6 : 3;
      return columns[prevY] + String(row);
    }

    return '-';
  }
}
