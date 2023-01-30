import * as moment from 'moment-timezone';

export enum SendResponse {
  WRONG_PASSWORD = 'Wrong password',
  USER_NOT_FOUND = 'User not found',
  USER_MIGHT_DELETED = 'User might got deleted, try login again to make sure',
  USER_DELETED = 'User deleted',
  USER_ALREADY_EXIST = 'User already exists',
  PRODUCT_ALREADY_EXIST = 'Product already exists',
  PRODUCT_NOT_FOUND = 'Product not found',
  PRODUCT_DELETED = 'Product deleted',
  ORDER_NOT_FOUND = 'Order not found',
  ORDER_DELETED = 'Order deleted',
  PAGE_LIMIT_ERROR = 'page limit exceeded',
  INVALID_ID_LENGTH = 'id length is not valid, should be 24 character long',
}

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

export enum DatabaseNames {
  PRODUCTS = 'products',
  USERS = 'users',
  ORDERS = 'orders',
}

export const createTimeStamp = () => moment().valueOf().toString();
