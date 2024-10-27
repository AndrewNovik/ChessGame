import { Component } from '@angular/core';
import { ChessBoard } from '../../board/board';
import {
  Color,
  Figure,
  FigureImageSource,
} from '../../interfaces/figures.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  private chessBoard = new ChessBoard();
  public figureImageSource = FigureImageSource;

  public chessBoardView: (Figure | null)[][] = this.chessBoard.chessBoardView;
  get playerColor(): Color {
    return this.chessBoard.playerColor;
  }

  isCellDark(x: number, y: number): boolean {
    return ChessBoard.isCellDark(x, y);
  }
}
