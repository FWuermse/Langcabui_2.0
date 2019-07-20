import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../languages/language.service';
import {LoginService} from '../login/login.service';
import {TrainService} from './train.service';
import {Message, MessageService} from '../message/message.service';
import {Word} from '../words/word';

@Component({
  selector: 'app-train-all',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainAllComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private languageService: LanguageService,
    public trainService: TrainService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.resetFlags();
    this.loginService.getToken().subscribe((token: string) => {
      this.trainService.getAllOverdueWords(token).subscribe((words: Word[]) => {
          this.trainService.maxAmount = words.length;
          this.trainService.overdueWords = this.trainService.shuffle(words);
          this.trainService.setFirstWord();
        },
        (err) => {
          this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
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
    this.trainService.random = false;
  }

  newWord() {
    this.trainService.overdueWords = this.trainService.shuffle(this.trainService.overdueWords);
    this.trainService.setFirstWord();
  }
}
