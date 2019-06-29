import { MessageService, Message } from './../message/message.service';
import { LoginService } from './../login.service';
import { LanguageService } from './../language.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import {catchError, tap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface PeriodicElement {
  wordEnglish: string;
  wordPinyin: string;
  wordChinese: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {wordEnglish: '1', wordPinyin: 'Hydrogen', wordChinese: 'H'},
  {wordEnglish: '2', wordPinyin: 'Helium', wordChinese: 'He'},
  {wordEnglish: '3', wordPinyin: 'Lithium', wordChinese: 'Li'},
  {wordEnglish: '4', wordPinyin: 'Beryllium', wordChinese: 'Be'},
  {wordEnglish: '5', wordPinyin: 'Boron', wordChinese: 'B'},
  {wordEnglish: '6', wordPinyin: 'Carbon', wordChinese: 'C'},
  {wordEnglish: '7', wordPinyin: 'Nitrogen', wordChinese: 'N'},
  {wordEnglish: '8', wordPinyin: 'Oxygen', wordChinese: 'O'},
  {wordEnglish: '9', wordPinyin: 'Fluorine', wordChinese: 'F'},
  {wordEnglish: '10', wordPinyin: 'Neon', wordChinese: 'Ne'},
];

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.scss']
})
export class WordsComponent implements OnInit {
  displayedColumns: string[] = ['wordEnglish', 'wordPinyin', 'wordChinese'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  value = '';

  constructor(private languageService: LanguageService, private loginService: LoginService, private messageService: MessageService) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.loginService.afAuth.idToken.subscribe((token: string) => {
      console.log(token);
      this.languageService.getLanguage(token).subscribe((language: string) => {
        console.log(language);
      },
      (err) => {console.error(err);
      });
    });
  }

}
