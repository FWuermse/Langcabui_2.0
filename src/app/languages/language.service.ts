import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message, MessageService} from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  url = 'https://www.langcab.com/api/language';
  language = '';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getLanguage(token: string): Observable<string> {
    if (!(this.language === '' || undefined)) {
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
      language.subscribe( (lang: string) => {
        this.language = lang;
      },
        (err) => {
        if (JSON.parse(err.error)['message'] === 'Welcome! Start by adding your first word.') {
          this.messageService.messages.push(new Message('Info', JSON.parse(err.error)['message'], 'alert-info'));
        } else {
          if (JSON.parse(err.error)['message'] === 'No message available') {
            this.messageService.messages.push(new Message('Warning', 'You are not logged in. Please log in by clicking on the profile icon.', 'alert-warning'));
          } else {
            this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
          }
        }
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
