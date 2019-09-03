import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  title = 'untitled';
  hanziList = undefined;
  index = 0;
  url = 'https://inputtools.google.com/request';
  input = '';
  showKeyboards = false;
  selectedKeyboard = 'zh-t-i0-pinyin';

  constructor(private http: HttpClient) {
  }

  search(query: string, amountOfResults: number) {
    this.index = 0;
    return this.http
      .get(`${this.url}?text=${this
        .removeHanzi(query)}&itc=${this.selectedKeyboard}&num=${amountOfResults}&cp=0&cs=1&ie=utf-8&oe=utf-8`)
      .subscribe((r) => {
        this.hanziList = r;
      });
  }

  moveNext() {
    if (this.index < 10) {
      this.index = this.index + 1;
    } else {
      this.index = 0;
    }
  }

  movePrevious() {
    if (this.index > 0) {
      this.index = this.index - 1;
    } else {
      this.index = 10;
    }
  }

  select(hanzi: string) {
    this.input = this.removePinyin(this.input, hanzi);
    this.search(this.input, 11);
  }

  removePinyin(input: string, hanzi: string): string {
    input.split('').forEach( (s: string) => {
      if (s.match(new RegExp(/[A-Za-z0-9]/i))) {
        input = input.replace(s, '');
      }
    });
    return input.concat(hanzi);
  }

  removeHanzi(hanzi: string): string {
    hanzi.split('').forEach( (s: string) => {
      if (s.match(new RegExp(/[^A-Za-z0-9]/i))) {
        hanzi = hanzi.replace(s, '');
      }
    });
    return hanzi;
  }
}
