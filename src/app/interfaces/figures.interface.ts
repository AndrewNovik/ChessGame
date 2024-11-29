import { FigurePiece } from '../figures/figures';

export enum Figure {
  WhitePawn = 'P',
  WhiteKnight = 'N',
  WhiteBishop = 'B',
  WhiteRook = 'R',
  WhiteQueen = 'Q',
  WhiteKing = 'K',

  BlackPawn = 'p',
  BlackKnight = 'n',
  BlackBishop = 'b',
  BlackRook = 'r',
  BlackQueen = 'q',
  BlackKing = 'k',
}

export enum Color {
  White = 'White',
  Black = 'Black',
}

export type Coordinate = {
  x: number;
  y: number;
};

export type FigureDirections = {
  x: number;
  y: number;
};

export type SelectedCell = CellWithFigure | CellWithOutFigure;

export type CellWithFigure = {
  figure: Figure;
  x: number;
  y: number;
};

type CellWithOutFigure = {
  figure: null;
  x?: number;
  y?: number;
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

export const promotedFigureTypes = {
  whiteList: [
    Figure.WhiteKnight,
    Figure.WhiteBishop,
    Figure.WhiteRook,
    Figure.WhiteQueen,
  ],
  blaclList: [
    Figure.BlackKnight,
    Figure.BlackBishop,
    Figure.BlackRook,
    Figure.BlackQueen,
  ],
};

export type SafeMoves = Map<string, Coordinate[]>;

export type LastMove = {
  piece: FigurePiece;
  prevX: number;
  prevY: number;
  currX: number;
  currY: number;
};

type KingChecked = {
  isInCheck: true;
  x: number;
  y: number;
};

type KingNotChecked = {
  isInCheck: false;
};

export type KingChecking = KingChecked | KingNotChecked;
