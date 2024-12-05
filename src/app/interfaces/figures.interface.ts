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
  [Figure.WhitePawn]: 'assets/images/png/bw/wp.png',
  [Figure.WhiteKnight]: 'assets/images/png/bw/wn.png',
  [Figure.WhiteBishop]: 'assets/images/png/bw/wb.png',
  [Figure.WhiteRook]: 'assets/images/png/bw/wr.png',
  [Figure.WhiteQueen]: 'assets/images/png/bw/wq.png',
  [Figure.WhiteKing]: 'assets/images/png/bw/wk.png',
  [Figure.BlackPawn]: 'assets/images/png/bw/bp.png',
  [Figure.BlackKnight]: 'assets/images/png/bw/bn.png',
  [Figure.BlackBishop]: 'assets/images/png/bw/bb.png',
  [Figure.BlackRook]: 'assets/images/png/bw/br.png',
  [Figure.BlackQueen]: 'assets/images/png/bw/bq.png',
  [Figure.BlackKing]: 'assets/images/png/bw/bk.png',
};

export const ShotDownFigureImageSource: Readonly<Record<Figure, string>> = {
  [Figure.WhitePawn]: 'assets/images/png/bw/wps.png',
  [Figure.WhiteKnight]: 'assets/images/png/bw/wns.png',
  [Figure.WhiteBishop]: 'assets/images/png/bw/wbs.png',
  [Figure.WhiteRook]: 'assets/images/png/bw/wrs.png',
  [Figure.WhiteQueen]: 'assets/images/png/bw/wqs.png',
  [Figure.WhiteKing]: 'assets/images/png/bw/wks.png',
  [Figure.BlackPawn]: 'assets/images/png/bw/bps.png',
  [Figure.BlackKnight]: 'assets/images/png/bw/bns.png',
  [Figure.BlackBishop]: 'assets/images/png/bw/bbs.png',
  [Figure.BlackRook]: 'assets/images/png/bw/brs.png',
  [Figure.BlackQueen]: 'assets/images/png/bw/bqs.png',
  [Figure.BlackKing]: 'assets/images/png/bw/bks.png',
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
  promotedPiece?: Figure;
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

export type ShotDownFigures = {
  whiteSideFigures: Figure[];
  blackSideFigures: Figure[];
  count: number;
};
