import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../language.service';
import {LoginService} from '../login.service';
import {TrainService} from '../train.service';
import {Message, MessageService} from '../message/message.service';

@Component({
  selector: 'app-train-all',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainAllComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private languageService: LanguageService,
    private trainService: TrainService,
    private messageService: MessageService
  ) { }

  overdueWords: Word[];
  wordSuggestions: Word[];
  amount = 10;
  progress = 20;
  selectedWord = {
    wordId: 1,
    wordEnglish: 'hi',
    wordPinyin: 'bye',
    wordChinese: 'dskfj',
    language: 'Chinese'
  };
  onCheck = false;
  response = '';
  color = 'border-primary';
  tipNeeded = false;

  private wordRevert(word: Word) {
    return new Word(word.wordId, word.wordChinese, word.wordPinyin, word.wordEnglish, word.language);
  }

  ngOnInit() {
  }

  revert() {
    this.selectedWord = this.wordRevert(this.selectedWord);
    this.tipNeeded = false;
    this.wordSuggestions = [];
  }

  getOverdueWords() {
    this.loginService.getToken().subscribe( (token: string) => {
      this.languageService.getLanguage(token).subscribe( (language: string) => {
        this.trainService.getOverdueWords(token, language).subscribe( (words: Word[]) => {
          this.overdueWords = this.shuffle(words);
        });
      },
        (err) => {
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
        });
    });
    //setFirstWord();
  }

  enableSuggestion() {
    console.log('suggestion set');
  }

  getSuggestion(word: Word): string {
    return '';
  }

  submit(response: string) {
    console.log('submitted');
  }

  newWord() {
    console.log('setting new Word...');
  }

  shuffle(array): Word[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
