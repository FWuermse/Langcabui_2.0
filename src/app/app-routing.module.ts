import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {WordDetailComponent} from './word-detail/word-detail.component';
import {WordsComponent} from './words/words.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'word/:id', component: WordDetailComponent},
  { path: 'words', component: WordsComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit/:id', component: EditComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
