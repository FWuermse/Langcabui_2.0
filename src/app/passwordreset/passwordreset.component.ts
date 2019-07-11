import {Component} from '@angular/core';
import {LoginService} from '../login.service';
import {Location} from '@angular/common';
import {Message, MessageService} from '../message/message.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordResetComponent {
  email: string;

  constructor(private loginService: LoginService, private location: Location, private messageService: MessageService) {
  }

  submit() {
    this.loginService.resetPassword(this.email);
    this.location.back();
    this.messageService.messages.push(new Message('Success: ', 'A password reset link has been sent to the following email: ' + this.email, 'alert-success'));
  }
}
