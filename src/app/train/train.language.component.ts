import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-train-language',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainLanguageComponent implements OnInit {

  overdueWords: Word[];
  wordSuggestions: Word[];
  amount = 10;
  progress = 20;
  selectedWord = {
    wordId: 1,
    wordEnglish: 'hi',
    wordPinyin: 'bye',
    wordChinese: 'dskfj',
    language: 'Chinese'
  };
  onCheck = false;
  response = '';

  constructor(private languageService: LanguageService) { }

  ngOnInit() {
  }

  enableSuggestion() {
    console.log('suggestion set');
  }

  revert() {
    console.log('reverted');
  }

  getSuggestion(word: Word): string {
    return '';
  }

  submit(response: string) {
    console.log('submitted');
  }

  newWord() {
    console.log('setting new Word...');
  }
}
