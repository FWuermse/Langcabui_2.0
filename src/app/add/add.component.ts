import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LanguageService} from '../languages/language.service';
import {LoginService} from '../login/login.service';
import {Message, MessageService} from '../message/message.service';
import {Location} from '@angular/common';
import {WordsService} from '../words/words.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(
    public wordsService: WordsService,
    private languageService: LanguageService,
    private loginService: LoginService,
    private messageService: MessageService,
    private location: Location,
    private fb: FormBuilder
  ) {
  }
  language: string;

  word = this.fb.group({
    wordEnglish: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    wordChinese: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    wordPinyin: ['', Validators.maxLength(100)],
    language: ['', Validators.compose([Validators.required, Validators.maxLength(100)])]
  });

  ngOnInit() {
    this.loginService.getToken().subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe((language: string) => {
          this.language = language;
          this.word.controls['language'].setValue(language);
        });
    });
  }

  goBack() {
    this.location.back();
  }

  add() {
    this.loginService.getToken().subscribe((token: string) => {
      this.wordsService.add(this.word.value, token).subscribe(() => {
        this.location.back();
      },
      (err) => {
        this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'], 'alert-danger'));
      });
    });
  }
}
