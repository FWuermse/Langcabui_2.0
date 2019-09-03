import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as levenshtein from 'fast-levenshtein';
import {Word} from '../words/word';
import {Message, MessageService} from '../message/message.service';
import {__await} from 'tslib';
import {LoginService} from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  url = 'https://www.langcab.com/api/learn';

  overdueWords: Word[] = [];
  wordSuggestions: Word[];
  maxAmount = 0;
  progress = 0;
  selectedWord: Word;
  onCheck = false;
  response = '';
  color = 'border-primary';
  tipNeeded = false;
  reverted = false;
  random: boolean;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private loginService: LoginService) {
  }

  shuffle(array): Word[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    if (difficulty <= 2) {
      return 'text-white bg-danger';
    } else {
      return 'text-white bg-success';
    }
  }

  afterTrain(word: Word, difficulty: number, token: string) {
    if (!word.tags.find((tag: string) => tag === 'repeat')) {
      return this.http.post(`${this.url}/`, {
        id: word.wordId, di: difficulty
      }, {
        headers: {'Authorization': `${token}`}
      }).subscribe(),
        (err) => {
        this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
      };
    }
  }

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

  wordRevert(word: Word) {
    return new Word(word.wordId, word.wordChinese, word.wordPinyin, word.wordEnglish, word.language, word.tags);
  }

  revert() {
    this.overdueWords = this.shuffle(this.overdueWords);
    if (this.reverted) {
      this.selectedWord = this.overdueWords[this.overdueWords.length - 1];
    } else {
      this.selectedWord = this.wordRevert(this.overdueWords[this.overdueWords.length - 1]);
    }
    this.tipNeeded = false;
    this.reverted = !this.reverted;
    this.wordSuggestions = [];
  }

  setFirstWord() {
    this.onCheck = false;
    this.color = 'border-primary';
    this.response = '';
    this.tipNeeded = false;
    this.wordSuggestions = [];
    if (!this.reverted) {
      this.selectedWord = this.overdueWords[this.overdueWords.length - 1];
    } else {
      this.selectedWord = this.wordRevert(this.overdueWords[this.overdueWords.length - 1]);
    }
  }

  enableSuggestion() {
    this.loginService.getToken().subscribe((token: string) => {
      this.getWordSuggestions(token, this.selectedWord.language).subscribe((words: Word[]) => {
          this.tipNeeded = true;
          if (this.reverted) {
            this.wordSuggestions = this.shuffle(words.filter((wordSuggestion: Word) =>
              wordSuggestion.wordChinese !== this.selectedWord.wordChinese).concat(this.selectedWord));
          } else {
            this.wordSuggestions = this.shuffle(words.filter((wordSuggestion: Word) =>
              wordSuggestion.wordEnglish !== this.selectedWord.wordEnglish).concat(this.selectedWord));
          }
        },
        (err) => {
          this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
        });
    });
  }

  submit() {
    const difficulty = this.check(this.response, this.selectedWord, this.tipNeeded);
    this.response = this.selectedWord.wordEnglish;
    this.loginService.getToken().subscribe((token: string) => {
      __await(this.afterTrain(this.selectedWord, difficulty, token));
      if (difficulty <= 2) {
        this.selectedWord.tags.push('repeat');
      } else {
        this.overdueWords.pop();
      }
      this.color = this.setColour(difficulty);
      this.onCheck = true;
      this.progress = this.calculateProgress(this.maxAmount, this.overdueWords.length);
    }, (err) => {
      this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
    });
  }
}
