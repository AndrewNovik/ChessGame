import {
  Coordinate,
  Figure,
  PiecesColor,
} from '../interfaces/figures.interface';

export abstract class FigurePiece {
  protected abstract _Figure: Figure;
  protected abstract _coordinates: Coordinate[]; // available mooves ?

  constructor(private _color: PiecesColor) {}

  get figure(): Figure {
    return this._Figure;
  }

  get coordinates(): Coordinate[] {
    return this._coordinates;
  }

  get color(): PiecesColor {
    return this._color;
  }
}
