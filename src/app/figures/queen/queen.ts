import {
  Figure,
  Coordinate,
  PiecesColor,
} from '../../interfaces/figures.interface';
import { FigurePiece } from '../figures';

export class Queen extends FigurePiece {
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
      pieceColor === PiecesColor.White ? Figure.WhiteQueen : Figure.BlackQueen;
  }
}
