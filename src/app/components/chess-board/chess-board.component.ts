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

  selectCell(x: number, y: number): void {
    const figurePiece: FigurePiece | null =
      this.chessBoard.chessBoardFigures[x][y];
    const figure: Figure | null = this.chessBoardView[x][y];
    if (
      JSON.stringify(this.selectedCell) === JSON.stringify({ figure, x, y })
    ) {
      this.selectedCell = { figure: null };
      this.figureSafeCells = [];
      return;
    }

    if (!figure) return;

    if (this.isEnemyFigureSelected(figurePiece)) return;

    this.selectedCell = { figure, x, y };
    this.figureSafeCells = this.safeCells.get(x + ',' + y) || [];
  }

  public replaceFigure(newX: number, newY: number): void {
    if (!this.selectedCell.figure) return;

    if (!this.isCellSafeForSelectedFigure(newX, newY)) return;

    const { x: prevX, y: prevY } = this.selectedCell;

    this.chessBoard.moveFigure(prevX, prevY, newX, newY);
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.figureSafeCells = [];
  }

  public move(x: number, y: number): void {
    this.selectCell(x, y);
    this.replaceFigure(x, y);
  }

  private isEnemyFigureSelected(figure: FigurePiece | null): boolean {
    const isWhiteFigureSelected: boolean = figure?.color === this.playerColor;

    return !isWhiteFigureSelected;
  }
}
