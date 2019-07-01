import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

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
}
