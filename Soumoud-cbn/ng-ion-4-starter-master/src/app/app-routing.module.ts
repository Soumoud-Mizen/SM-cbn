import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutingInterceptior } from '../app/interceptors/routing.interceptor';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register-consumer',
    loadChildren: () =>
      import('./pages/register-consumer/register-consumer.module').then(
        m => m.RegisterConsumerPageModule
      )
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'main-app-use',
    loadChildren: () =>
      import('./pages/main-app-use/main-app-use.module').then(
        m => m.MainAppUsePageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'consumer-app-use',
    loadChildren: () =>
      import('./pages/consumer-app-use/consumer-app-use.module').then(
        m => m.ConsumerAppUsePageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'admin-app-use/consumers/:id',
    loadChildren: () =>
      import('./pages/admin-app-use/consumers/consumer/consumer.module').then(
        m => m.ConsumerPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'admin-app-use/providers/:id',
    loadChildren: () =>
      import('./pages/admin-app-use/providers/provider/provider.module').then(
        m => m.ProviderPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'admin-app-use/providers-confirm/:id',
    loadChildren: () =>
      import(
        './pages/admin-app-use/providers-confirm/provider/provider.module'
      ).then(m => m.ProviderPageModule),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'consumer-app-use/profile',
    loadChildren: () =>
      import('./pages/consumer-app-use/profile/profile.module').then(
        m => m.ProfilePageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'admin-app-use',
    loadChildren: () =>
      import('./pages/admin-app-use/admin-app-use.module').then(
        m => m.AdminAppUsePageModule
      )
  },
  {
    path: 'admin-app-use/edit-user/:id/:role',
    loadChildren: () =>
      import('./pages/admin-app-use/edit-user/edit-user.module').then(
        m => m.EditUserPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'provider-app-use',
    loadChildren: () =>
      import('./pages/provider-app-use/provider-app-use.module').then(
        m => m.ProviderAppUsePageModule
      )
  },
  {
    path: 'provider-app-use/products',
    loadChildren: () =>
      import('./pages/provider-app-use/products/products.module').then(
        m => m.ProductsPageModule
      )
  },
  {
    path: 'provider-app-use/products/:id',
    loadChildren: () =>
      import('./pages/provider-app-use/products/product/product.module').then(
        m => m.ProductPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'provider-app-use/add-product',
    loadChildren: () =>
      import(
        './pages/provider-app-use/products/add-product/add-product.module'
      ).then(m => m.AddProductPageModule)
  },
  {
    path: 'provider-app-use/products/edit/:id',
    loadChildren: () =>
      import(
        './pages/provider-app-use/products/edit-product/edit-product.module'
      ).then(m => m.EditProductPageModule),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'admin-app-use/faq/show/:id',
    loadChildren: () =>
      import('./pages/admin-app-use/faq/show/show.module').then(
        m => m.ShowPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'consumer-app-use/faq/:type',
    loadChildren: () =>
      import('./pages/consumer-app-use/faq/faq.module').then(
        m => m.FaqPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'consumer-app-use/orders-history/order/:order_obj',
    loadChildren: () =>
      import('./pages/consumer-app-use/orders-history/order/order.module').then(
        m => m.OrderPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'consumer-app-use/chats/:room_prv_name',
    loadChildren: () =>
      import('./pages/consumer-app-use/chats/room/room.module').then(
        m => m.RoomPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'provider-app-use/chats/:id',
    loadChildren: () =>
      import('./pages/provider-app-use/chats/room/room.module').then(
        m => m.RoomPageModule
      ),
    canActivate: [RoutingInterceptior]
  },
  {
    path: 'guest',
    loadChildren: () => import('./pages/guest/guest.module').then( m => m.GuestPageModule)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
