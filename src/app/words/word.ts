export class Word {

  constructor(wordId: number, wordEnglish: string, wordPinyin: string, wordChinese: string, language: string, tags: string[]) {
    this.wordId = wordId;
    this.wordEnglish = wordEnglish;
    this.wordPinyin = wordPinyin;
    this.wordChinese = wordChinese;
    this.language = language;
    this.tags = tags;
  }

  wordId: number;
  wordEnglish: string;
  wordPinyin: string;
  wordChinese: string;
  language: string;
  tags: string[];
}
