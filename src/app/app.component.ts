import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginService} from './login/login.service';
import {KeyboardService} from './keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public dialog: MatDialog, public keyboardService: KeyboardService) {
  }

  openDialog(): void {
    this.dialog.open(LoginDialog);
  }

  ngOnInit(): void {
    document.body.classList.add('primary-theme', 'mat-app-background');
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login/login-dialog.html'
})
export class LoginDialog {
  hide = true;

  constructor(public dialogRef: MatDialogRef<LoginDialog>, private fb: FormBuilder, public loginService: LoginService) {
  }

  signIn = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose(([Validators.minLength(8), Validators.maxLength(25)]))]
  });

  signUp = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose(([Validators.minLength(8), Validators.maxLength(25)]))]
  });

  getSignInEmailMessage() {
    return this.signIn.controls['email'].hasError('required') ? 'You must enter a value' :
      this.signIn.controls['email'].hasError('email') ? 'Not a valid email' :
        '';
  }

  getSignInPasswordMessage() {
    return this.signIn.controls['password'].hasError('required') ? 'You must enter a value' :
      this.signIn.controls['password'].hasError('minlength') ? 'Your password is too short' :
        this.signIn.controls['password'].hasError('maxlength') ? 'Your password is too long' :
          '';
  }

  getSignUpEmailMessage() {
    return this.signUp.controls['email'].hasError('required') ? 'You must enter a value' :
      this.signUp.controls['email'].hasError('email') ? 'Not a valid email' :
        '';
  }

  getSignUpPasswordMessage() {
    return this.signUp.controls['password'].hasError('required') ? 'You must enter a value' :
      this.signUp.controls['password'].hasError('minlength') ? 'Your password is too short' :
        this.signUp.controls['password'].hasError('maxlength') ? 'Your password is too long' :
          '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
