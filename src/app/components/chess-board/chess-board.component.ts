import { Component } from '@angular/core';
import { ChessBoard } from '../../board/board';
import {
  Color,
  Coordinate,
  Figure,
  FigureImageSource,
  SafeMoves,
  SelectedCell,
} from '../../interfaces/figures.interface';
import { CommonModule } from '@angular/common';
import { FigurePiece } from '../../figures/figures';
import { isEquel } from '../../utils/helpers';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  private chessBoard: ChessBoard;
  private selectedCell: SelectedCell;
  private figureSafeCells: Coordinate[];
  public figureImageSource = FigureImageSource;
  public chessBoardView: (Figure | null)[][];

  constructor() {
    this.chessBoard = new ChessBoard();
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.selectedCell = { figure: null };
    this.figureSafeCells = [];
  }

  get playerColor(): Color {
    return this.chessBoard.playerColor;
  }
  get safeCells(): SafeMoves {
    return this.chessBoard.safeCells;
  }

  ngOnInit() {}

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

  move(x: number, y: number): void {
    const figure: Figure | null = this.chessBoardView[x][y];
    if (isEquel(this.selectedCell, { figure, x, y })) {
      // удаляем выбранную фигуру и ее возможные ходы,
      // если до этого ее выбрали  выходим из функции.
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
      this.replaceFigure(x, y);
      return;
    }
    // если проверки выше не прошли, значит мы первый раз выбрали фигуру,
    // значит засетим ей ячейку и возможные доступные ходы.
    this.selectedCell = { figure, x, y };
    this.figureSafeCells = this.safeCells.get(x + ',' + y) || [];
  }

  public replaceFigure(newX: number, newY: number): void {
    this.chessBoard.moveFigure(
      this.selectedCell.x!,
      this.selectedCell.y!,
      newX,
      newY
    );
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.figureSafeCells = [];
    this.selectedCell = { figure: null };
  }

  // private isEnemyFigureSelected(figure: FigurePiece | null): boolean {
  //   return figure?.color === this.playerColor ? false : true;
  // }
}
