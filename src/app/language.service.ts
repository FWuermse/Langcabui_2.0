import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  url = 'https://www.langcab.com/api/language';
  language = '';

  constructor(private http: HttpClient) { }

  getLanguage(token: string): Observable<string> {
    if (this.language !== '') {
      return new Observable( observer => {
        observer.next(this.language);
        observer.complete();
      });
    } else {
      const language =  this.http.get(this.url + '/last',
        {
          headers: {'Authorization': `${token}`},
          responseType: 'text'
        });
      language.subscribe( (l: string) => {
        this.language = l;
      });
      return language;
    }
  }

  setLanguage(language: string) {
    this.language = language;
  }

  getMyLanguages(token: string): Observable<string[]> {
    return this.http.get<string[]>(this.url + '/mine',
      {
        headers: {'Authorization': `${token}`}
      });
  }
}
