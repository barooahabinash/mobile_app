import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
/* /:referesh redirect the page with a random number as argument  and it treated it as a new page*/
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:[
      {
        path: 'home',
        children: [
          {
            path: 'shop',
            loadChildren: () => import('../shop/shop.module').then( m => m.ShopPageModule)
          },
          {
            path: 'products-list/:referesh',
            loadChildren: () => import('../products-list/products-list.module').then( m => m.ProductsListPageModule)
          },
          {
            path: 'product-detail/:referesh',
            loadChildren: () => import('../product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          },
          {
            path: 'search/:referesh',
            loadChildren: () => import('../search/search.module').then( m => m.SearchPageModule)
          },
          {
            path: 'links',
            loadChildren: () => import('../links/links.module').then( m => m.LinksPageModule)
          }
        ]
      },
      {
        path: 'menu',
        children: [
          {
            path: 'mainmenu',
            loadChildren: () => import('../mainmenu/mainmenu.module').then( m => m.MainmenuPageModule)
          },
          {
            path: 'submenuone',
            loadChildren: () => import('../submenuone/submenuone.module').then( m => m.SubmenuonePageModule)
          },
          {
            path: 'products-list/:referesh',
            loadChildren: () => import('../products-list/products-list.module').then( m => m.ProductsListPageModule)
          },
          {
            path: 'product-detail/:referesh',
            loadChildren: () => import('../product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          },
          {
            path: 'search/:referesh',
            loadChildren: () => import('../search/search.module').then( m => m.SearchPageModule)
          }
        ]
        
      },
      {
        path: 'wishlist',
        children: [
          {
            path: 'wish-list',
            loadChildren: () => import('../wish-list/wish-list.module').then( m => m.WishListPageModule)
          },
          {
            path: 'products-list/:referesh',
            loadChildren: () => import('../products-list/products-list.module').then( m => m.ProductsListPageModule)
          },
          {
            path: 'product-detail/:referesh',
            loadChildren: () => import('../product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          },
          {
            path: 'search/:referesh',
            loadChildren: () => import('../search/search.module').then( m => m.SearchPageModule)
          }
        ]
      },
      {
        path: 'morelist',
        children: [
          {
            path: 'more',
            loadChildren: () => import('../more/more.module').then( m => m.MorePageModule)
          },
          {
            path: 'products-list/:referesh',
            loadChildren: () => import('../products-list/products-list.module').then( m => m.ProductsListPageModule)
          },
          {
            path: 'product-detail/:referesh',
            loadChildren: () => import('../product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          },
          {
            path: 'search/:referesh',
            loadChildren: () => import('../search/search.module').then( m => m.SearchPageModule)
          },
          {
            path: 'links',
            loadChildren: () => import('../links/links.module').then( m => m.LinksPageModule)
          },
          {
            path: 'order-history',
            loadChildren: () => import('../order-history/order-history.module').then( m => m.OrderHistoryPageModule)
          },
          {
            path: 'address-book',
            loadChildren: () => import('../address-book/address-book.module').then( m => m.AddressBookPageModule)
          },
          {
            path: 'address',
            loadChildren: () => import('../address/address.module').then( m => m.AddressPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home/shop',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home/shop',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
