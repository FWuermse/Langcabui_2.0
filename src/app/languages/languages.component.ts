import {Component, OnInit} from '@angular/core';
import {Message, MessageService} from '../message/message.service';
import {LoginService} from '../login/login.service';
import {Location} from '@angular/common';
import {LanguageService} from './language.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  languages: string[];
  currentLanguage: string;

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private languageService: LanguageService,
    private location: Location) {
  }

  ngOnInit() {
    this.changeColours(document.body.classList.item(0));
    this.getLanguages();
  }

  getLanguages() {
    this.loginService.getToken().subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe( (language: string) => {
        this.currentLanguage = language;
      });
      this.languageService.getMyLanguages(token).subscribe((languages: string[]) => {
          this.languages = languages;
        },
        (err) => {
          this.messageService.messages.push(new Message('Error', JSON.parse(err.error)['message'] + '. Are you logged in?', 'alert-danger'));
        });
    });
  }

  changeLanguage(language: string) {
    switch (this.languages.findIndex(x => x === language)) {
      case 0:
        this.changeColours('primary-theme');
        break;
      case 1:
        this.changeColours('secondary-theme');
        break;
      case 2:
        this.changeColours('tertiary-theme');
        break;
      default:

    }
    this.languageService.setLanguage(language);
    this.location.back();
  }

  changeColours(theme: string) {
    switch (theme) {
      case 'primary-theme':
        break;
      case 'secondary-theme':
        break;
      case 'tertiary-theme':
        break;
      default:
        this.messageService.messages.push(new Message('An error occurred: ', 'No theme selected.', 'alert-danger'));
    }
    this.changeTheme(theme);
  }

  changeTheme(theme: string) {
    document.body.classList.forEach((token: string) => {
      document.body.classList.remove(token);
    });
    document.body.classList.add(theme);
  }
}
