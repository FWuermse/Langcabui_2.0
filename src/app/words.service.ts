import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Word} from './words/word';

class Pagable {
  totalPages: number;
  number: number;
  content: Word[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  url = 'https://www.langcab.com/api/word';
  currentPage = 0;
  totalPages = 0;
  totalWords = 0;

  constructor(private http: HttpClient) {
  }

  getAll(
    token: string,
    query: string,
    language: string,
    sort: string,
    size: number,
    page: number,
    sortDirection: string
  ): Observable<Word[]> {
    const subject = new Subject<Word[]>();
    this.http.get<Pagable>(`${this.url}/?search=${query}&language=${language}&page=${page}&size=${size}&sort=${sort},${sortDirection}`,
      {
        headers: {'Authorization': `${token}`}
      }).subscribe((pagable: Pagable) => {
      this.totalPages = pagable.totalPages;
      this.currentPage = pagable.number;
      this.totalWords = pagable.totalElements;
      subject.next(pagable.content);
    });
    return subject.asObservable();
  }

  add(word: Word, token: string) {
    return this.http.post(this.url + '/', word, {
      headers: {'Authorization': `${token}`}
    });
  }

  delete(word: Word, token: string) {
    return this.http.delete(`${this.url}/${word.wordId}`, {
      headers: {'Authorization': `${token}`}
    });
  }

  getById(token: string, id: number) {
    return this.http.get(`${this.url}/${id}`, {
      headers: {'Authorization': `${token}`}
    });
  }
}

