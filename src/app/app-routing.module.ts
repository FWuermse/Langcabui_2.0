import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {WordsComponent} from './words/words.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {TrainComponent} from './train/train.component';
import {PasswordResetComponent} from './passwordreset/passwordreset.component';
import {HomeComponent} from './home/home.component';
import {LanguagesComponent} from './languages/languages.component';
import {PrivacyComponent} from './termsandprivacy/privacy.component';
import {TermsComponent} from './termsandprivacy/terms.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'words', component: WordsComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'train', component: TrainComponent},
  { path: 'account/password/reset', component: PasswordResetComponent},
  { path: 'home', component: HomeComponent},
  { path: 'languages', component: LanguagesComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'terms', component: TermsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
