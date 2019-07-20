import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../languages/language.service';
import {LoginService} from '../login/login.service';
import {TrainService} from './train.service';
import {Message, MessageService} from '../message/message.service';
import {Word} from '../words/word';
import {FullPageable, FullWord, WordsService} from '../words/words.service';
import {noUndefined} from '@angular/compiler/src/util';

@Component({
  selector: 'app-random-language',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainRandomComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private languageService: LanguageService,
    private trainService: TrainService,
    private messageService: MessageService,
    private wordsService: WordsService
  ) {
  }

  ngOnInit() {
    this.resetFlags();
    this.loginService.getToken().subscribe((token: string) => {
        this.languageService.getLanguage(token).subscribe((language: string) => {
          this.wordsService.getAllPageable(
            token, '', language, 'timeCreated', 1, 0, 'ASC').subscribe((p: FullPageable) => {
            this.wordsService.getAllPageable(
              token, '', language, 'timeCreated', 1, Math.floor(Math.random() * p.totalElements), 'ASC')
              .subscribe((pagable: FullPageable) => {
                this.trainService.maxAmount = pagable.totalElements;
                this.trainService.overdueWords = [this.toWord(pagable.content[0]), this.toWord(pagable.content[0])];
                this.trainService.maxAmount = pagable.totalElements;
                this.trainService.setFirstWord();
              });
          }, (err) => {
            this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
          });
        });
      });
  }

  resetFlags() {
    this.trainService.overdueWords = [];
    this.trainService.wordSuggestions = undefined;
    this.trainService.maxAmount = 0;
    this.trainService.progress = 0;
    this.trainService.selectedWord = undefined;
    this.trainService.onCheck = false;
    this.trainService.response = '';
    this.trainService.color = 'border-primary';
    this.trainService.tipNeeded = false;
    this.trainService.reverted = false;
    this.trainService.random = true;
  }

  newWord() {
    this.trainService.overdueWords = this.trainService.shuffle(this.trainService.overdueWords);
    this.setFirstWord();
  }

  setFirstWord() {
    this.trainService.onCheck = false;
    this.trainService.color = 'border-primary';
    this.trainService.response = '';
    this.trainService.tipNeeded = false;
    this.trainService.wordSuggestions = [];
    this.setRandomWord();
  }

  setRandomWord() {
    this.loginService.getToken()
      .subscribe((token: string) => {
          this.languageService.getLanguage(token)
            .subscribe((language: string) => {
              this.wordsService.getAllPageable(
                token, '', language, 'timeCreated', 1, 0, 'ASC')
                .subscribe((p: FullPageable) => {
                  this.wordsService.getAllPageable(
                    token, '', language, 'timeCreated', 1, Math.floor(Math.random() * p.totalElements), 'ASC')
                    .subscribe((pagable: FullPageable) => {
                      this.trainService.overdueWords.push(this.toWord(pagable.content[0]))
                      if (!this.trainService.reverted) {
                        this.trainService.selectedWord = this.toWord(pagable.content[0]);
                      } else {
                        this.trainService.selectedWord = this.trainService.wordRevert(this.toWord(pagable.content[0]));
                      }
                    });
                }, (err) => {
                  this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
                });
            });
        });
  }

  toWord(word: FullWord): Word {
    const newWord = new Word(word.wordId, word.wordEnglish, word.wordPinyin, word.wordChinese, word.language);
    newWord.tags = ['repeat'];
    return newWord;
  }
}
