import * as moment from 'moment-timezone';

export enum SendResponse {
  LOGGED_IN = 'logged in successfully',
  LOGGED_OUT = 'logged out successfully',
  LOGIN_FIRST = 'login first to proceed further',
  INVALID_ROUTE = 'Invalid route',
  WRONG_PASSWORD = 'Wrong password',
  EMPTY_FIELDS_ERROR = 'Empty field are not allowed',
  EMPTY_PARAMS_ERROR = 'Empty params are not allowed',
  USER_NOT_FOUND = 'User not found',
  USER_MIGHT_DELETED = `User might got deleted, try login again to make sure`,
  USER_DELETED = 'User deleted',
  USER_UPDATED = 'User updated',
  NOTHING_FOUND_FOR_USER = 'Nothing found for user',
  USER_ALREADY_EXIST = 'User already exists',
  PRODUCT_ALREADY_EXIST = 'Product already exists',
  PRODUCT_NOT_FOUND = 'Product not found',
  PRODUCT_DELETED = 'Product deleted',
  PRODUCT_UPDATED = 'Product updated',
  ORDER_NOT_FOUND = 'Order not found',
  ORDER_DELETED = 'Order deleted',
  ORDER_UPDATED = 'Order status updated',
  ORDER_PLACED = 'Order Placed',
  PAGE_LIMIT_ERROR = 'page limit exceeded',
  MIN_PRICE_ERROR = 'Price should not be less then 10',
  MIN_MAX_ORDER_QUANTITY_ERROR = ' Order Quantity should be between 1 and 20, Error at position this',

  EMPTY_EMAIL = 'Email is not valid',
  EMPTY_PASSWORD = 'Empty Password not Allowed',
  INVALID_PRODUCT_ID = 'Product Id is not valid',
  INVALID_PRODUCT_NAME = 'Product name is not valid',
  INVALID_PRODUCT_DESCRIPTION = 'Product description is not valid',
  INVALID_PRODUCT_NO = 'Product No is not valid',

  INVALID_USER_ID = 'User Id is not valid',
  INVALID_USER_NAME = 'User Name is not valid',
  INVALID_USER_ADDRESS = 'User address is not valid',
  INVALID_USER_EMAIL = 'User Email is not valid',
  INVALID_USER_PASSWORD = 'User password is not valid',
  INVALID_USER_OLD_PASSWORD = 'User Old password is not valid',
  INVALID_USER_NEW_PASSWORD = 'User New password is not valid',

  INVALID_ORDER_ID = 'Order ID is not valid',
}

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
}

export enum ObjectProperties {
  ID = 'id',
  NAME = 'name',
  ADDRESS = 'address',
  EMAIL = 'email',
  PASSWORD = 'password',
  OLD_PASSWORD = 'oldPassword',
  NEW_PASSWORD = 'newPassword',
  DESCRIPTION = 'description',
  PRICE = 'price',
  STATUS = 'status',
  PRODUCT_NO = 'productNo',
  PRODUCT = 'product',
  PRODUCT_ID = 'product.*.id',
  PRODUCT_QUANTITY = 'product.*.quantity',
}

export enum DatabaseNames {
  PRODUCTS = 'products',
  USERS = 'users',
  ORDERS = 'orders',
  JWTSTORE = 'jwtStore',
}

export const createTimeStamp = () => moment().valueOf().toString();
