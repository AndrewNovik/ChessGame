import {
  Figure,
  Color,
  FigureDirections,
} from '../interfaces/figures.interface';

export abstract class FigurePiece {
  protected abstract _Figure: Figure;
  protected abstract _figureDirections: FigureDirections[];

  constructor(private _color: Color) {}

  get figure(): Figure {
    return this._Figure;
  }

  get color(): Color {
    return this._color;
  }

  get figureDirections(): FigureDirections[] {
    return this._figureDirections;
  }
}
