import { Component } from '@angular/core';
import { ChessBoard } from '../../board/board';
import {
  CellWithFigure,
  Color,
  Coordinate,
  FigureImageSource,
  KingChecking,
  PrevMove,
  SafeMoves,
  SelectedCell,
} from '../../interfaces/figures.interface';
import { CommonModule } from '@angular/common';
import { isEquel } from '../../utils/helpers';
import { FigurePiece } from '../../figures/figures';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  private chessBoard: ChessBoard = new ChessBoard();
  private selectedCell: SelectedCell = { figure: null };
  private figureSafeCells: Coordinate[] = [];
  public figureImageSource = FigureImageSource;
  public chessBoardFigures: (FigurePiece | null)[][] =
    this.chessBoard.chessBoardFigures;
  public lastMove: PrevMove | undefined;
  public recordedMoves: PrevMove[] = [];
  private checkState: KingChecking = this.chessBoard.checkingKing;

  constructor() {}

  get playerColor(): Color {
    return this.chessBoard.playerColor;
  }
  get safeCells(): SafeMoves {
    return this.chessBoard.safeCells;
  }

  isCellDark(x: number, y: number): boolean {
    return ChessBoard.isCellDark(x, y);
  }

  isCellSelected(x: number, y: number): boolean {
    return this.selectedCell.x === x && this.selectedCell.y === y;
  }

  isCellSafeForSelectedFigure(x: number, y: number): boolean {
    return this.figureSafeCells.some(
      (mooves) => mooves.x === x && mooves.y === y
    );
  }

  isCellPrevMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return (x === prevX && y === prevY) || (x === currX && y === currY);
  }

  isKingChecked(x: number, y: number): boolean {
    return (
      this.checkState.isInCheck &&
      this.checkState.x === x &&
      this.checkState.y === y
    );
  }

  move(x: number, y: number): void {
    const piece: FigurePiece | null = this.chessBoardFigures[x][y];
    if (isEquel(this.selectedCell, { figure: piece?.figure || null, x, y })) {
      // удаляем выбранную фигуру и ее возможные ходы,
      // если до этого её выбрали и выходим из функции.
      this.selectedCell = { figure: null };
      this.figureSafeCells = [];
      return;
    } else if (
      this.selectedCell.figure &&
      this.isCellSafeForSelectedFigure(x, y)
    ) {
      // в противном случае, если уже была выбрана фигура
      // и мы выбрали возможный для нее ход,
      // перемещаем ее и просто выходим из функции.
      this.replaceFigure(x, y, this.selectedCell);
      return;
    }

    if (piece?.figure) {
      // если проверки выше не прошли, значит мы первый раз выбрали фигуру(клетку),
      // значит засетим ей ячейку и возможные доступные ходы, если выбрана клетка.
      this.selectedCell = { figure: piece.figure, x, y };
      this.figureSafeCells = this.safeCells.get(x + ',' + y) || [];
      return;
    }

    // если ничего выше не произошло, просто сетим выбранную ячейку и обнуляем возможно выбранные ранее мувы
    this.selectedCell = { figure: null, x, y };
    this.figureSafeCells = [];
  }

  public replaceFigure(
    newX: number,
    newY: number,
    selectedCell: CellWithFigure
  ): void {
    // помечаем предыдущий ход
    this.lastMove = {
      color: this.playerColor,
      prevX: selectedCell.x,
      prevY: selectedCell.y,
      currX: newX,
      currY: newY,
    };
    // TO DO красивые иконки ходов
    this.recordedMoves.push(this.lastMove);

    this.chessBoard.moveFigure(selectedCell.x, selectedCell.y, newX, newY);
    this.chessBoardFigures = this.chessBoard.chessBoardFigures;
    this.checkState = this.chessBoard.checkingKing;
    this.unmarkingSelectionAndSafeMoves();
  }

  private unmarkingSelectionAndSafeMoves(): void {
    this.figureSafeCells = [];
    this.selectedCell = { figure: null };
  }

  // private isEnemyFigureSelected(figure: FigurePiece | null): boolean {
  //   return figure?.color === this.playerColor ? false : true;
  // }
}
