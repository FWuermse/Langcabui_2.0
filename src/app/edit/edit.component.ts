import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LanguageService} from '../languages/language.service';
import {LoginService} from '../login/login.service';
import {MessageService} from '../message/message.service';
import { Location } from '@angular/common';
import {WordsService} from '../words/words.service';
import {ActivatedRoute} from '@angular/router';
import {Word} from '../words/word';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
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
    this.loginService.getToken().subscribe((token: string) => {
      const id = +this.route.snapshot.paramMap.get('id');
      this.wordsService.getById(token, id).subscribe((word: Word) => {
        this.word = this.fb.group(word);
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
    this.loginService.getToken().subscribe((token: string) => {
      this.wordsService.add(this.word.value, token).subscribe( () => {
        this.location.back();
      });
    });
  }
}
