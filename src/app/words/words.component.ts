import {Message, MessageService} from './../message/message.service';
import {LoginService} from '../login/login.service';
import {LanguageService} from '../languages/language.service';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {WordsService} from './words.service';
import {Word} from './word';

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

  displayedColumns: string[] = ['wordEnglish', 'wordPinyin', 'wordChinese', 'wordId'];
  dataSource = new MatTableDataSource(this.words);

  constructor(
    private languageService: LanguageService,
    private wordsService: WordsService,
    private loginService: LoginService,
    private messageService: MessageService,
    public dialog: MatDialog) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loginService.getToken().subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe((language: string) => {
          this.language = language;
          this.getWords(language, this.pageSize, this.pageIndex, this.pageSort, this.pageSortDirection);
        },
        (err) => {
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
        });
    });
  }

  private getWords(language: string, size: number, page: number, pageSort: string, pageSortDirection: string) {
    this.loginService.getToken().subscribe((token: string) => {
      this.token = token;
      this.wordsService.getAll(
        token, this.searchQuery, language, pageSort, size, page, pageSortDirection
      ).subscribe((words: undefined) => {
          this.words = words;
          this.dataSource = new MatTableDataSource(this.words);
        },
        (err) => {
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
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

  delete(word: Word): void {
    const dialogRef = this.dialog.open(AreYouSureDialog, {data: word});
    dialogRef.afterClosed().subscribe(n => {
      this.getWords(this.language, this.pageSize, 0, this.pageSort, this.pageSortDirection);
    });
  }
}

@Component({
  selector: 'are-you-sure-dialog',
  template: `
    <mat-dialog-content class="mat-typography">
      <p>Are you sure you want to delete this word: {{data.wordEnglish}}?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-button mat-dialog-close (click)="onNoClick()">No</button>
      <button mat-button mat-dialog-close (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
  `,
})
export class AreYouSureDialog {

  constructor(
    private loginService: LoginService,
    private wordsService: WordsService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<AreYouSureDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Word) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.delete(this.data);
    this.dialogRef.close();
  }

  delete(word: Word) {
    this.loginService.getToken().subscribe((token: string) => {
      this.wordsService.delete(word, token).subscribe(n => {
        this.messageService.messages.push(new Message('Success!', `${word.wordEnglish} has been deleted successfully`, 'alert-success'));
      });
    });
  }
}
