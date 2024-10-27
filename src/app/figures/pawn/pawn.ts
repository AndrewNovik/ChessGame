import {
  Figure,
  Coordinate,
  PiecesColor,
} from '../../interfaces/figures.interface';
import { FigurePiece } from '../figures';

export class Pawn extends FigurePiece {
  private _hasMoved: boolean = false;
  protected override _Figure: Figure;
  protected override _coordinates: Coordinate[] = [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ];

  constructor(private pieceColor: PiecesColor) {
    super(pieceColor);
    if (pieceColor === PiecesColor.Black) this.setBlackPawnCoordinates();
    this._Figure =
      pieceColor === PiecesColor.White ? Figure.WhitePawn : Figure.BlackPawn;
  }

  private setBlackPawnCoordinates(): void {
    this._coordinates = this._coordinates.map(({ x, y }) => ({ x: -1 * x, y }));
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  public set hasMoved(_) {
    this._hasMoved = true;
    this._coordinates = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ];
    if (this.pieceColor === PiecesColor.Black) this.setBlackPawnCoordinates();
  }
}
