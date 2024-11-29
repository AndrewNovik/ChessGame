import { Component } from '@angular/core';
import { ChessBoard } from '../../board/board';
import {
  CellWithFigure,
  Color,
  Coordinate,
  Figure,
  FigureImageSource,
  KingChecking,
  LastMove,
  promotedFigureTypes,
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
  public lastMove: LastMove | undefined = this.chessBoard.lastMove;
  public recordedMoves: LastMove[] = [];
  private checkState: KingChecking = this.chessBoard.checkingKing;

  public isPromotionActive: boolean = false;
  private promotionCoordinate: Coordinate | null = null;
  private promotedFigure: Figure | null = null;
  public availablePromotionFigureTypes(): Figure[] {
    return this.playerColor === Color.White
      ? promotedFigureTypes.whiteList
      : promotedFigureTypes.blaclList;
  }

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
    const { prevX, prevY, currX, currY } = this.chessBoard.lastMove!;
    return (x === prevX && y === prevY) || (x === currX && y === currY);
  }

  isKingChecked(x: number, y: number): boolean {
    return (
      this.checkState.isInCheck &&
      this.checkState.x === x &&
      this.checkState.y === y
    );
  }

  // является ли клетка выбранной для превращения
  isCellPromotionCell(x: number, y: number): boolean {
    if (!this.promotionCoordinate) return false;
    return this.promotionCoordinate.x === x && this.promotionCoordinate.y === y;
  }

  move(x: number, y: number): void {
    const piece: FigurePiece | null = this.chessBoardFigures[x][y];
    if (isEquel(this.selectedCell, { figure: piece?.figure || null, x, y })) {
      // удаляем выбранную фигуру и ее возможные ходы,
      // если до этого её выбрали и выходим из функции.
      this.selectedCell = { figure: null };
      this.figureSafeCells = [];

      // если кликнули на туже пешку, то убираем модалку превращения
      if (this.isPromotionActive) {
        this.isPromotionActive = false;
        this.promotionCoordinate = null;
      }
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
      // если кликнули на другую клетку, то убираем модалку превращения,
      // если она была открыта
      if (this.isPromotionActive) {
        this.isPromotionActive = false;
        this.promotionCoordinate = null;
      }
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
    // является ли выбранная фигура пешкой и мы пытаемся ей походить
    const isPawnSelected: boolean =
      this.chessBoardFigures[selectedCell.x][selectedCell.y]?.figure ===
        Figure.WhitePawn ||
      this.chessBoardFigures[selectedCell.x][selectedCell.y]?.figure ===
        Figure.BlackPawn;

    // стоит на ряду перед превращением
    const isPawnOnLastYrow: boolean =
      isPawnSelected && (newX === 7 || newX === 0);

    // если модалка превращения закрыта и пешка стоит на последнем ряду
    const isPromotionModalOpen: boolean =
      !this.isPromotionActive && isPawnOnLastYrow;

    // то убираем возможные ходы для того чтобы пометить координаты превращения
    // убираем другие доступные ходы пока ждем выбора и открываяем модалку с фигурами
    if (isPromotionModalOpen) {
      this.figureSafeCells = [];
      this.isPromotionActive = true;
      this.promotionCoordinate = { x: newX, y: newY };

      // ждем выбора фигуры
      return;
    }

    this.updateBoard(this.selectedCell.x!, this.selectedCell.y!, newX, newY);
  }

  updateBoard(prevX: number, prevY: number, newX: number, newY: number) {
    this.chessBoard.moveFigure(prevX, prevY, newX, newY, this.promotedFigure);
    this.chessBoardFigures = this.chessBoard.chessBoardFigures;
    this.checkState = this.chessBoard.checkingKing;
    // помечаем предыдущий ход
    this.lastMove = this.chessBoard.lastMove;
    // TO DO красивые иконки ходов
    this.recordedMoves.push(this.lastMove!);
    this.unmarkingSelectionAndSafeMoves();
  }

  // отрабрабатывает по клику по фигуре в модалке превращения
  public promoteFigure(figure: Figure): void {
    if (!this.promotionCoordinate || !this.selectedCell.figure) return;

    // важно задать фигуру превращения
    this.promotedFigure = figure;
    const { x: newX, y: newY } = this.promotionCoordinate;
    const { x: prevX, y: prevY } = this.selectedCell;
    // перемещает пешку как бы, но из-за того что уже есть промоутед фигура, она передастся как параметр и совершится именно превращение. Обнуление модалки происходит дальше
    this.updateBoard(prevX, prevY, newX, newY);
  }

  private unmarkingSelectionAndSafeMoves(): void {
    this.figureSafeCells = [];
    this.selectedCell = { figure: null };

    // обнуление модалки если она была открыта
    if (this.isPromotionActive) {
      this.isPromotionActive = false;
      this.promotedFigure = null;
      this.promotionCoordinate = null;
    }
  }

  // закрывается по клику во вью
  public closePawnPromotion(): void {
    this.unmarkingSelectionAndSafeMoves();
  }

  // private isEnemyFigureSelected(figure: FigurePiece | null): boolean {
  //   return figure?.color === this.playerColor ? false : true;
  // }
}
