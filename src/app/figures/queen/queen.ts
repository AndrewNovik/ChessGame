import { Figure, Coordinate, Color } from '../../interfaces/figures.interface';
import { FigurePiece } from '../figures';

export class Queen extends FigurePiece {
  protected override _Figure: Figure;
  protected override _coordinates: Coordinate[] = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  constructor(private pieceColor: Color) {
    super(pieceColor);
    this._Figure =
      pieceColor === Color.White ? Figure.WhiteQueen : Figure.BlackQueen;
  }
}
