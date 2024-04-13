import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage
      ),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // {
  //   path: 'explore',
  //   loadComponent: () =>
  //     import('./tabs/explore/explore.page').then((m) => m.ExplorePage),
  // },
  // {
  //   path: 'my-workouts',
  //   loadComponent: () =>
  //     import('./tabs/my-workouts/my-workouts.page').then(
  //       (m) => m.MyWorkoutsPage
  //     ),
  // },
  // {
  //   path: 'favorites',
  //   loadComponent: () =>
  //     import('./tabs/favorites/favorites.page').then((m) => m.FavoritesPage),
  // },
  // {
  //   path: 'account',
  //   loadComponent: () =>
  //     import('./tabs/account/account.page').then((m) => m.AccountPage),
  // },
];
