import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../languages/language.service';
import {LoginService} from '../login/login.service';
import {TrainService} from './train.service';
import {Message, MessageService} from '../message/message.service';
import {Word} from '../words/word';
import {__await} from 'tslib';

@Component({
  selector: 'app-train-all',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainAllComponent implements OnInit {
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

  constructor(
    private loginService: LoginService,
    private languageService: LanguageService,
    private trainService: TrainService,
    private messageService: MessageService
  ) {
  }

  private wordRevert(word: Word) {
    return new Word(word.wordId, word.wordChinese, word.wordPinyin, word.wordEnglish, word.language);
  }

  ngOnInit() {
    this.loginService.getToken().subscribe((token: string) => {
      this.trainService.getAllOverdueWords(token).subscribe((words: Word[]) => {
          this.maxAmount = words.length;
          this.overdueWords = this.shuffle(words);
          this.setFirstWord();
        },
        (err) => {
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
        });
    });
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
      this.trainService.getWordSuggestions(token, this.selectedWord.language).subscribe((words: Word[]) => {
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
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
        });
    });
  }

  submit() {
    const difficulty = this.trainService.check(this.response, this.selectedWord, this.tipNeeded);
    this.response = this.selectedWord.wordEnglish;
    this.loginService.getToken().subscribe((token: string) => {
      __await(this.trainService.afterTrain(this.selectedWord, difficulty, token));
      if (difficulty <= 2) {
        this.selectedWord.tags.push('repeat');
      } else {
        this.overdueWords.pop();
      }
      this.color = this.trainService.setColour(difficulty);
      this.onCheck = true;
      this.progress = this.trainService.calculateProgress(this.maxAmount, this.overdueWords.length);
    });
  }

  newWord() {
    this.overdueWords = this.shuffle(this.overdueWords);
    this.setFirstWord();
  }

  shuffle(array): Word[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
