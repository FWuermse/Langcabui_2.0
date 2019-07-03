import {Message, MessageService} from './message/message.service';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {__await} from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public afAuth: AngularFireAuth, private messageService: MessageService) {
  }

  getToken() {
    if (this.afAuth.idToken) {
      return this.afAuth.idToken;
    } else {
      this.messageService.messages.push(
        new Message('Warning: ', `You are not logged in. Please login to take any action.`, 'alert-warning'));
    }
  }

  googleLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((user => {
      this.messageService.messages.push(
        new Message('Success: ', `You successfully logged in as ${user.user.displayName}`, 'alert-success')
      );
    })));
  }

  facebookLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then((user => {
      this.messageService.messages.push(
        new Message('Success: ', `You successfully logged in as ${user.user.displayName}`, 'alert-success')
      );
    })));
  }

  twitterLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider()).then((user => {
      this.messageService.messages.push(new Message('Success: ', 'You successfully logged in via Twitter!', 'alert-success'));
    })));
  }

  gitHubLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider()).then((user => {
      this.messageService.messages.push(new Message('Success: ', `You successfully logged in as ${user.user.email}`, 'alert-success'));
    })));
  }

  signIn(form: any) {
    this.afAuth.auth.signInWithEmailAndPassword(form.email, form.password).then((user) => {
      if (!user.user.emailVerified) {
        this.messageService.messages.push(new Message('Warning: ',
          `You need to verify your email (${user.user.email}) before logging in.`, 'alert-warning'));
        this.logout();
      }
    });
  }

  signUp(form: any) {
    this.afAuth.auth.createUserWithEmailAndPassword(form.email, form.password)
      .then((user) => {
        this.messageService.messages.push(new Message('Success! ', `Your account has been created: ${user.user.email}`, 'alert-success'));
        __await(user.user.sendEmailVerification());
        __await(this.afAuth.auth.signOut());
      })
      .then(() => {
        this.messageService.messages.push(new Message('Info: ', 'An Email verification has been sent to your email.', 'alert-info'));
      })
      .then(() => {
        this.logout();
        this.messageService.messages.push(
          new Message('Warning: ', 'You have been logged out until you verify your email.', 'alert-warning')
        );
      })
      .catch(function (error) {
        new Message('An error occurred: ', error, 'alert-danger');
      });
  }

  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email).then( n => {
      this.messageService.messages.push(new Message('Success! ', `A password reset link has been sent to: ${email}`, 'alert-success'));
    });
  }

  logout() {
    (this.afAuth.auth.signOut().then( n => {
      this.messageService.messages.push(
        new Message('Success: ', 'You are logged out', 'alert-success'));
    }));
  }
}
