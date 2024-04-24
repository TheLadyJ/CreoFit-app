import { Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedLoginTo = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToTabs = () => redirectLoggedInTo(['tabs']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page').then((m) => m.LoginPage),
    ...canActivate(redirectLoggedInToTabs),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.page').then((m) => m.RegisterPage),
    ...canActivate(redirectLoggedInToTabs),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage
      ),
    ...canActivate(redirectLoggedInToTabs),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    ...canActivate(redirectUnauthorizedLoginTo),
  },
];
