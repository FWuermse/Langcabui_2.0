export class Word {

  constructor(wordId: number, wordEnglish: string, wordPinyin: string, wordChinese: string, language: string) {
    this.wordId = wordId;
    this.wordEnglish = wordEnglish;
    this.wordPinyin = wordPinyin;
    this.wordChinese = wordChinese;
    this.language = language;
  }

  wordId: number;
  wordEnglish: string;
  wordPinyin: string;
  wordChinese: string;
  language: string;
}
