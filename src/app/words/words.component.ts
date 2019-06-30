import {MessageService} from './../message/message.service';
import {LoginService} from './../login.service';
import {LanguageService} from './../language.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {WordsService} from '../words.service';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.scss']
})
export class WordsComponent implements OnInit {
  words: Word[];
  selected: Word;
  searchQuery = '';
  language: string;
  pageSort = 'timeCreated';
  pageSortDirection = 'DESC';
  pageIndex = 0;
  pageSize = 10;
  button: boolean;
  token: string;

  displayedColumns: string[] = ['wordEnglish', 'wordPinyin', 'wordChinese'];
  dataSource = new MatTableDataSource(this.words);

  constructor(
    private languageService: LanguageService,
    private wordsService: WordsService,
    private loginService: LoginService,
    private messageService: MessageService) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loginService.afAuth.idToken.subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe((language: string) => {
          this.language = language;
          this.getWords(language, this.pageSize, this.pageIndex, this.pageSort, this.pageSortDirection);
        },
        (err) => {
          this.messageService.messages.concat(err);
        });
    });
  }

  private getWords(language: string, size: number, page: number, pageSort: string, pageSortDirection: string) {
    this.loginService.afAuth.idToken.subscribe((token: string) => {
      this.token = token;
      this.wordsService.getWordsSearch(
        token, this.searchQuery, language, pageSort, size, page, pageSortDirection
      ).subscribe((words: undefined) => {
          this.words = words;
          this.dataSource = new MatTableDataSource(this.words);
        },
        (err) => {
          this.messageService.messages.concat(err);
        });
    });
  }

  changePage(event) {
    this.pageSize = event.pageSize;
    this.getWords(this.language, event.pageSize, event.pageIndex, this.pageSort, this.pageSortDirection);
  }

  changeSort(event) {
    this.pageSort = event.active;
    this.pageSortDirection = event.direction.toUpperCase();
    this.paginator.firstPage();
    this.getWords(this.language, this.pageSize, 0, event.active, event.direction.toUpperCase());
  }

  search() {
    this.getWords(this.language, this.pageSize, 0, this.pageSort, this.pageSortDirection);
  }
}
