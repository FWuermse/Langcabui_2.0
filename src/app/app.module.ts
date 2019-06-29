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
  MatSortModule
} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { WordsComponent } from './words/words.component';
import { WordDetailComponent } from './word-detail/word-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    WordsComponent,
    WordDetailComponent,
    DashboardComponent,
    LoginDialog,
    MessageComponent
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
    HttpClientModule
  ],
  entryComponents: [LoginDialog],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
