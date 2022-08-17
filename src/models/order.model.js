import Model from '../database';
import AppError from '../middlewares/error/AppError';
import OrderDetail from './orderDetail.model';
import Payment from './payment.model';

class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  static get idColumn() {
    return 'orderNumber';
  }

  static get relationMappings() {
    return {
      orderdetails: {
        relation: Model.HasManyRelation,
        modelClass: OrderDetail,
        join: {
          from: 'orders.orderNumber',
          to: 'orderdetails.orderNumber',
        },
      },
      payments: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: 'orders.orderNumber',
          to: 'payments.orderNumber',
        },
      },
    };
  }

  static async get(condition) {
    try {
      const result = await Order.query().where(condition);

      return result;
    } catch (error) {
      throw new AppError('ERROR @Order.get: Something went wrong', 500);
    }
  }

  static async getOne(condition) {
    try {
      const result = await Order.query()
        .where(condition)
        .withGraphFetched('[orderdetails, payments]');

      return result[0] || {};
    } catch (error) {
      throw new AppError('ERROR @Order.getOne: Something went wrong', 500);
    }
  }

  static async getManyByOrderNumber(idArr, condition) {
    try {
      const result = await Order.query()
        .whereIn('customerNumber', idArr)
        .where(condition);

      return result;
    } catch (error) {
      throw new AppError(
        `ERROR @Order.getManyByOrderNumber: Internal Server Error`,
        500,
      );
    }
  }

  static async update(orderNumber, data) {
    try {
      const result = await Order.query().patchAndFetchById(orderNumber, data);

      return result;
    } catch (error) {
      throw new AppError('ERROR @Order.update: Internal Server Error', 500);
    }
  }
}

export default Order;
