/* eslint-disable */

import { Route as rootRouteImport } from './routes/__root'
import { Route as CartRouteImport } from './routes/cart'
import { Route as BookServiceRouteImport } from './routes/book-service'
import { Route as AccessoriesRouteImport } from './routes/accessories'
import { Route as IndexRouteImport } from './routes/index'

const CartRoute = CartRouteImport.update({
  id: '/cart',
  path: '/cart',
  getParentRoute: () => rootRouteImport,
})
const BookServiceRoute = BookServiceRouteImport.update({
  id: '/book-service',
  path: '/book-service',
  getParentRoute: () => rootRouteImport,
})
const AccessoriesRoute = AccessoriesRouteImport.update({
  id: '/accessories',
  path: '/accessories',
  getParentRoute: () => rootRouteImport,
})
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
})

const rootRouteChildren = {
  IndexRoute: IndexRoute,
  AccessoriesRoute: AccessoriesRoute,
  BookServiceRoute: BookServiceRoute,
  CartRoute: CartRoute,
}

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)
