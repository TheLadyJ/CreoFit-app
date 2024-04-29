import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedLoginTo = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    ...canActivate(redirectUnauthorizedLoginTo),
    children: [
      {
        path: 'my-workouts',
        loadComponent: () =>
          import('./my-workouts/my-workouts.page').then(
            (m) => m.MyWorkoutsPage
          ),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./explore/explore.page').then((m) => m.ExplorePage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./account/account.page').then((m) => m.AccountPage),
      },
      {
        path: '',
        redirectTo: '/tabs/explore',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./explore/search/search.page').then((m) => m.SearchPage),
  },
  {
    path: 'explore/workout/:id',
    loadComponent: () =>
      import('./explore/workout-details/workout-details.page').then(
        (m) => m.WorkoutDetailsPage
      ),
  },
  {
    path: 'my-workouts/workout/:id',
    loadComponent: () =>
      import('./explore/workout-details/workout-details.page').then(
        (m) => m.WorkoutDetailsPage
      ),
  },
  {
    path: 'favorites/workout/:id',
    loadComponent: () =>
      import('./explore/workout-details/workout-details.page').then(
        (m) => m.WorkoutDetailsPage
      ),
  },
  {
    path: 'search/workout/:id',
    loadComponent: () =>
      import('./explore/workout-details/workout-details.page').then(
        (m) => m.WorkoutDetailsPage
      ),
  },
];
