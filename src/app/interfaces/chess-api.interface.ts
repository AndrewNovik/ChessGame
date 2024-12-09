import { Figure } from './figures.interface';

export type ChessApiRequest = {
  fen: string;
  depth: number;
};

export type ChessApiMove = {
  prevX: number;
  prevY: number;
  newX: number;
  newY: number;
  promotedPiece: Figure | null;
};

export type ChessApiResponce = {
  bestMove: ChessApiMove;
  eval: string;
};

export type ChessApiEndResponce = {
  bestMove: ChessApiMove;
  eval: string;
};
