import { Coordinate, Figure, Color } from '../interfaces/figures.interface';

export abstract class FigurePiece {
  protected abstract _Figure: Figure;
  protected abstract _coordinates: Coordinate[]; // available mooves ?

  constructor(private _color: Color) {}

  get figure(): Figure {
    return this._Figure;
  }

  get coordinates(): Coordinate[] {
    return this._coordinates;
  }

  get color(): Color {
    return this._color;
  }
}
