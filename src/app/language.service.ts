import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  url = 'https://www.langcab.com/api/language';
  language: string;

  constructor(private http: HttpClient) { }

  getLanguage(token: string): Observable<string> {
    return this.http.get<string>(this.url + '/last',
    {
      headers: {'Authorization': `${token}`},
    });
  }

}
