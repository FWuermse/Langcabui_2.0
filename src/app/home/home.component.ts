import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginDialog} from '../app.component';

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
    if (window.screen.width > 1600) {
      this.showAds = true;
    }
  }

}
