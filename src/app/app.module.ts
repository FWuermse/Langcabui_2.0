import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent, LoginDialog} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';

import {
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatDialogModule,
  MatTabsModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatChipsModule,
  MatProgressBarModule,
  MatDividerModule,
  MatRippleModule,
  MatCard,
  MatCardModule,
  MatGridListModule, MatProgressSpinnerModule,
} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import {AreYouSureDialog, WordsComponent} from './words/words.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { TrainComponent } from './train/train.component';
import {TrainAllComponent} from './train/train.all.component';
import {TrainLanguageComponent} from './train/train.language.component';
import { PasswordResetComponent } from './passwordreset/passwordreset.component';
import { HomeComponent } from './home/home.component';
import { LanguagesComponent } from './languages/languages.component';

@NgModule({
  declarations: [
    AppComponent,
    WordsComponent,
    DashboardComponent,
    MessageComponent,
    AddComponent,
    EditComponent,
    LoginDialog,
    AreYouSureDialog,
    TrainComponent,
    TrainAllComponent,
    TrainLanguageComponent,
    TrainLanguageComponent,
    PasswordResetComponent,
    HomeComponent,
    LanguagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    AppRoutingModule,
    MatDialogModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatRippleModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [LoginDialog, AreYouSureDialog],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
