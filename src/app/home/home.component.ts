import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginDialog} from '../app.component';
import {debounceTime, map} from 'rxjs/operators';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showAds: boolean;

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    this.dialog.open(LoginDialog);
  }

  ngOnInit() {
    this.showAds = document.body.offsetWidth > 1400;
    const checkScreenSize = () => document.body.offsetWidth > 1400;
    fromEvent(window, 'resize').pipe(debounceTime(100)).pipe(map(checkScreenSize)).subscribe( screenBiggerThan => {
      this.showAds = screenBiggerThan;
    });
  }

}
