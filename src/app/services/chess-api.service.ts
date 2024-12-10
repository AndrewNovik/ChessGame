import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import {
  ChessApiResponce,
  ChessApiMove,
  ChessApiRequest,
} from '../interfaces/chess-api.interface';
import { Figure } from '../interfaces/figures.interface';
import { yToNum } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class ChessApiService {
  private readonly api: string = 'https://tjconsulting.solutions/';
  constructor(private http: HttpClient) {}

  private promotedPiece(piece: string | undefined): Figure | null {
    if (!piece) return null;
    if (piece === 'n') return Figure.BlackKnight;
    if (piece === 'b') return Figure.BlackBishop;
    if (piece === 'r') return Figure.BlackRook;
    if (piece === 'q') return Figure.BlackQueen;
    return null;
  }

  private convertMoveFromChessApi(move: string): ChessApiMove {
    const prevY: number = yToNum(move[0]);
    const prevX: number = Number(move[1]) - 1;
    const newY: number = yToNum(move[2]);
    const newX: number = Number(move[3]) - 1;
    const promotedPiece = this.promotedPiece(move[4]);

    return { prevX, prevY, newX, newY, promotedPiece };
  }

  getBestMove(fen: string): Observable<ChessApiResponce> {
    const params: ChessApiRequest = {
      fen: fen,
      depth: 1,
    };

    return this.http.post<ChessApiResponce>(this.api, { ...params }).pipe(
      switchMap((responce: any) => {
        const endResponce: ChessApiResponce = {
          bestMove: this.convertMoveFromChessApi(responce.bestMove),
          eval: responce.eval,
        };

        return of(endResponce);
      })
    );
  }
}
