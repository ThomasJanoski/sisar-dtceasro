import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaixaListComponent } from './components/caixa-list/caixa-list.component';
import { CaixaFormComponent } from './components/caixa-form/caixa-form.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protege o Dashboard e todas as rotas filhas
    children: [
      { path: 'caixas', component: CaixaListComponent },
      { path: 'caixas/new', component: CaixaFormComponent },
      { path: 'caixas/:id/edit', component: CaixaFormComponent },
      { path: '', redirectTo: 'caixas', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];