import React from 'react';
import Loadable from 'react-loadable'
import ReactLoading from 'react-loading'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <ReactLoading type='bubbles' color='#20a8d8' style={{flex:1}} />
}

const ProductList = Loadable({
  loader: () => import('./views/Base/ProductList'),
  loading: Loading,
});

const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const NewProduct = Loadable({
  loader: () => import('./views/Base/NewProduct/index.jsx'),
  loading: Loading
})


const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/productList', name: 'Product List', component: ProductList },
  { path: '/addProduct', name: 'New Product', component: NewProduct },
];

export default routes;
