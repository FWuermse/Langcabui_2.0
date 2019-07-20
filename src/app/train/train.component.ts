import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../languages/language.service';
import {Message, MessageService} from '../message/message.service';
import {LoginService} from '../login/login.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-train',
  template: `
    <mat-tab-group (selectedIndexChange)="selected.setValue($event)" mat-align-tabs="center">
      <mat-tab label="{{language}} words">
        <app-train-language *ngIf="selected.value === 0"></app-train-language>
      </mat-tab>
      <mat-tab label="All words">
        <app-train-all  *ngIf="selected.value === 1"></app-train-all>
      </mat-tab>
    </mat-tab-group>`,
  styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

  language = '';
  selected = new FormControl(0);

  constructor(
    private loginService: LoginService,
    private languageService: LanguageService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loginService.getToken().subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe((language: string) => {
          this.language = language;
        },
        (err) => {
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
        });
    });
  }

}
