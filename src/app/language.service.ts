import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  url = 'https://www.langcab.com/api/language';

  constructor(private http: HttpClient) { }

  getLanguage(token: string): Observable<string> {
    return this.http.get(this.url + '/last',
    {
      headers: {'Authorization': `${token}`},
      responseType: 'text'
    });
  }

}
