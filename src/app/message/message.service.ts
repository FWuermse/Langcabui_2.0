import { Injectable } from '@angular/core';

export class Message {

  messageHeader: String;
  messageBody: String;
  messageColour: String;

  constructor(messageHeader: String, messageBody: String, messageColour: String) {
      this.messageHeader = messageHeader;
      this.messageBody = messageBody;
      this.messageColour = messageColour;
    }
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  constructor() { }
}
