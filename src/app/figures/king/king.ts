import {
  Figure,
  Coordinate,
  PiecesColor,
} from '../../interfaces/figures.interface';
import { FigurePiece } from '../figures';

export class King extends FigurePiece {
  private _hasMoved: boolean = false;
  protected override _Figure: Figure;
  protected override _coordinates: Coordinate[] = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  constructor(private pieceColor: PiecesColor) {
    super(pieceColor);
    this._Figure =
      pieceColor === PiecesColor.White ? Figure.WhiteKing : Figure.BlackKing;
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  public set hasMoved(_) {
    this._hasMoved = true;
  }
}
