import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LanguageService} from '../language.service';
import {LoginService} from '../login.service';
import {MessageService} from '../message/message.service';
import {Location} from '@angular/common';
import {WordsService} from '../words.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(
    private wordsService: WordsService,
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
    this.loginService.afAuth.idToken.subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe((language: string) => {
          this.language = language;
          this.word.controls['language'].setValue(language);
        },
        (err) => {
          this.messageService.messages.concat(err);
        });
    });
  }

  goBack() {
    this.location.back();
  }

  add() {
    this.loginService.afAuth.idToken.subscribe((token: string) => {
      this.wordsService.add(this.word.value, token).subscribe(n => {
        this.location.back();
      });
    });
  }
}
