import {
  Figure,
  Color,
  FigureDirections,
} from '../../interfaces/figures.interface';
import { FigurePiece } from '../figures';

export class Pawn extends FigurePiece {
  private _hasMoved: boolean = false;
  protected override _Figure: Figure;
  protected override _figureDirections: FigureDirections[] = [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ];

  constructor(private pieceColor: Color) {
    super(pieceColor);
    if (pieceColor === Color.Black) this.setBlackPawnCoordinates();
    this._Figure =
      pieceColor === Color.White ? Figure.WhitePawn : Figure.BlackPawn;
  }

  private setBlackPawnCoordinates(): void {
    this._figureDirections = this._figureDirections.map(({ x, y }) => ({
      x: -1 * x,
      y,
    }));
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  public set hasMoved(_) {
    this._hasMoved = true;
    this._figureDirections = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ];
    if (this.pieceColor === Color.Black) this.setBlackPawnCoordinates();
  }
}
