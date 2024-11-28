import { Bishop } from '../figures/bishop/bishop';
import { King } from '../figures/king/king';
import { Knight } from '../figures/knight/knight';
import { Pawn } from '../figures/pawn/pawn';
import { Queen } from '../figures/queen/queen';
import { Rook } from '../figures/rook/rook';
import { Color } from '../interfaces/figures.interface';

export const startBoardPosition = [
  [
    new Rook(Color.White),
    new Knight(Color.White),
    new Bishop(Color.White),
    new Queen(Color.White),
    new King(Color.White),
    new Bishop(Color.White),
    new Knight(Color.White),
    new Rook(Color.White),
  ],
  [
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
  ],
  [
    new Rook(Color.Black),
    new Knight(Color.Black),
    new Bishop(Color.Black),
    new Queen(Color.Black),
    new King(Color.Black),
    new Bishop(Color.Black),
    new Knight(Color.Black),
    new Rook(Color.Black),
  ],
];
