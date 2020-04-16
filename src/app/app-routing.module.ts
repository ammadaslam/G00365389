import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },

  {
    path: 'groceries',
    loadChildren: () => import('./pages/groceries/groceries.module').then( m => m.GroceriesPageModule)
  },
  {
    path: 'grocery/:id',
    loadChildren: () => import('./pages/grocery/grocery.module').then( m => m.GroceryPageModule)
  },
  {
    path: 'items',
    loadChildren: () => import('./pages/items/items.module').then( m => m.ItemsPageModule)
  },
  {
    path: 'item/:id',
    loadChildren: () => import('./pages/item/item.module').then( m => m.ItemPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
