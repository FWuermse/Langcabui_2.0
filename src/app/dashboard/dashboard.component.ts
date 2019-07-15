import {Component, OnInit} from '@angular/core';
import {Message, MessageService} from '../message/message.service';
import {LanguageService} from '../language.service';
import {FullPageable, FullWord, WordsService} from '../words.service';
import {LoginService} from '../login.service';
import {applySourceSpanToExpressionIfNeeded} from '@angular/compiler/src/output/output_ast';

class WordsDay {
  amountAddedPerDay: number;
  averageDifficultyThatDay: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  language: string;
  token: string;
  totalWords: number;
  days: number;
  difficultWords: number;
  lastStudied: number;
  wordsAddedPerDay: number;
  daysWithoutAdding: number;
  suggestedAmountToAdd: number;

  constructor(
    private languageService: LanguageService,
    private wordsService: WordsService,
    private loginService: LoginService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.loginService.getToken().subscribe((token: string) => {
      this.languageService.getLanguage(token).subscribe((language: string) => {
          this.language = language;
          this.setTotalWords(token, language);
        },
        (err) => {
          this.messageService.messages.push(new Message('An error occurred: ', `${err.error.message || err.message}`, 'alert-danger'));
        });
    });
  }

  setTotalWords(token: string, language: string) {
    this.wordsService.getAllPageable(
      token, '', language, 'timeCreated', 1, this.wordsService.currentPage, 'ASC'
    ).subscribe((pageable: FullPageable) => {
      this.totalWords = pageable.totalElements;
      const diff = Math.abs(new Date(pageable.content[0].timeCreated).getTime() - new Date().getTime());
      this.days = Math.ceil(diff / (1000 * 3600 * 24) + 1);
      this.setDifficultWords(token, language);
    });
  }

  setDifficultWords(token: string, language: string) {
    this.wordsService.getAllPageable(
      token, '', language, 'timeCreated', this.totalWords, this.wordsService.currentPage, 'ASC'
    ).subscribe((pageable: FullPageable) => {
      this.difficultWords = pageable.content.filter((word: FullWord) => {
        return word.difficulty < 1.4;
      }).length;
      this.lastStudied = Math.ceil(
        Math.abs(
          new Date(pageable.content.sort(
            (a, b) => new Date(
              a.timePractice).getTime() - new Date(b.timePractice).getTime())
            [this.difficultWords].timePractice).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      this.setWordsAddedPerDay(pageable);
    });
  }

  setWordsAddedPerDay(pageable: FullPageable) {
    const words: number[] = [];
    for (let i = 0; i < this.days; i++) {
      const length = pageable.content.filter((word: FullWord) => {
        return Math.ceil(Math.abs(new Date(word.timeCreated).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) === i;
      }).length;
      if (length > 0) {
        words.push(length);
      }
    }
    this.daysWithoutAdding = this.days - words.length;
    this.wordsAddedPerDay = Math.round(words.reduce((sum, current) => sum + current) / words.length * 100) / 100;
    this.setAddSuggestionPerDay(pageable);
  }

  setAddSuggestionPerDay(pageable: FullPageable) {
    const daysWordsAdded: WordsDay[] = [];
    for (let i = 0; i < this.days; i++) {
      const words: FullWord[] = [];
      const wordsPerDay = pageable.content.filter((word: FullWord) => {
        return Math.ceil(Math.abs(new Date(word.timeCreated).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) === i;
      });
      if (wordsPerDay.length > 0) {
        wordsPerDay.forEach((word: FullWord) => {
          words.push(word);
        });
        const wordDay = new WordsDay();
        wordDay.averageDifficultyThatDay = Math.round(
          words.reduce((sum, current) => sum + current.difficulty, 0) / words.length * 100) / 100;
        wordDay.amountAddedPerDay = words.length;
        daysWordsAdded.push(wordDay);
      }
    }
    this.suggestedAmountToAdd = Math.round(
      daysWordsAdded.sort(
        ((a, b) => b.averageDifficultyThatDay - a.averageDifficultyThatDay)).slice(
        0, Math.round(
          daysWordsAdded.length / 3)).reduce(
        (sum, current) => sum + current.amountAddedPerDay, 0) / Math.round(
      daysWordsAdded.length / 3) * 100) / 100;
  }
}
