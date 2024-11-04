export enum Figure {
  WhitePawn = 'WP',
  WhiteKnight = 'WN',
  WhiteBishop = 'WB',
  WhiteRook = 'WR',
  WhiteQueen = 'WQ',
  WhiteKing = 'WK',

  BlackPawn = 'BP',
  BlackKnight = 'BN',
  BlackBishop = 'BB',
  BlackRook = 'BR',
  BlackQueen = 'BQ',
  BlackKing = 'BK',
}

export enum Color {
  White = 'White',
  Black = 'Black',
}

export type Coordinate = {
  x: number;
  y: number;
};

export type SelectedCell = CellWithFigure | CellWithOutFigure;

type CellWithFigure = {
  figure: Figure;
  x: number;
  y: number;
};

type CellWithOutFigure = {
  figure: null;
};

export const FigureImageSource: Readonly<Record<Figure, string>> = {
  [Figure.WhitePawn]: 'assets/images/png/wp.png',
  [Figure.WhiteKnight]: 'assets/images/png/wn.png',
  [Figure.WhiteBishop]: 'assets/images/png/wb.png',
  [Figure.WhiteRook]: 'assets/images/png/wr.png',
  [Figure.WhiteQueen]: 'assets/images/png/wq.png',
  [Figure.WhiteKing]: 'assets/images/png/wk.png',
  [Figure.BlackPawn]: 'assets/images/png/bp.png',
  [Figure.BlackKnight]: 'assets/images/png/bn.png',
  [Figure.BlackBishop]: 'assets/images/png/bb.png',
  [Figure.BlackRook]: 'assets/images/png/br.png',
  [Figure.BlackQueen]: 'assets/images/png/bq.png',
  [Figure.BlackKing]: 'assets/images/png/bk.png',
};

export type SafeMoves = Map<string, Coordinate[]>;
