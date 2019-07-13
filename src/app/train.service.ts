import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as levenshtein from 'fast-levenshtein';
import {Word} from './words/word';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  url = 'https://www.langcab.com/api/learn';

  constructor(private http: HttpClient) {
  }

  getOverdueWords(token: string, language: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${this.url}/?language=${language}`,
      {
        headers: {'Authorization': `${token}`}
      });
  }

  getAllOverdueWords(token: string): Observable<Word[]> {
    return this.http.get<Word[]>(this.url + '/all',
      {
        headers: {'Authorization': `${token}`}
      });
  }

  getWordSuggestions(token: string, language: string) {
    return this.http.get<Word[]>(`${this.url}/choice/?language=${language}`,
      {
        headers: {'Authorization': `${token}`}
      });
  }

  check(response: string, selectedWord: Word, tipNeeded: boolean) {
    const difference = levenshtein.get(response.replace(/\s/g, '').toLowerCase(),
      selectedWord.wordEnglish.replace(/\s/g, '').toLowerCase());
    if (tipNeeded) {
      if (difference < 1) {
        return 3;
      } else {
        return 1;
      }
    } else if (selectedWord.wordEnglish.length > 25) {
      if (difference === 1 || difference === 2 || difference === 3) {
        return 4;
      } else if (difference > 3) {
        return 1;
             }
    } else if (selectedWord.wordEnglish.length > 11) {
      if (difference === 1 || difference === 2) {
        return 4;
      } else if (difference > 2) {
        return 1;
             }
    } else if (selectedWord.wordEnglish.length > 5) {
      if (difference === 1) {
        return 4;
      } else if (difference > 1) {
        return 1;
             }
    } else {
      if (difference > 0) {
        return 1;
      }
    }
    return 5;
  }

  setColour(difficulty: any) {
    if (difficulty <= 1) {
      return 'text-white bg-danger';
    } else {
      return 'text-white bg-success';
    }
  }

  afterTrain(wordId: number, difficulty: any) { }

  calculateProgress(maxAmount: number, amount: number): number {
  if (amount === 0) {
    return 100;
  } else {
    const wordsDone = maxAmount - amount;
    const average = wordsDone / maxAmount;
    const percent = average * 100;
    return +Math.round(percent).toFixed();
  }
}
}
