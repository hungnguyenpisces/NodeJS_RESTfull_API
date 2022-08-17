import _ from 'lodash';
import Model from '../database';
import AppError from '../middlewares/error/AppError';

const errorMess = 'Internal Server Error';

class OrderDetail extends Model {
  static get tableName() {
    return 'orderdetails';
  }

  static get idColumn() {
    return ['orderNumber', 'producCode'];
  }

  static async get(condition) {
    try {
      const result = await OrderDetail.query().where(condition);

      if (_.isEmpty(result)) {
        throw new AppError(
          'ERROR @OrderDetail.get: No OrderDetails found',
          404,
        );
      }

      return result;
    } catch (error) {
      throw new AppError(
        error.message ? error.message : `ERROR @OrderDetail.get: ${errorMess}`,
        error.statusCode || 500,
      );
    }
  }

  static async update(compositeKey, data) {
    try {
      const result = await OrderDetail.query().patchAndFetchById(
        compositeKey,
        data,
      );

      if (_.isEmpty(result)) {
        throw new AppError(
          'ERROR @OrderDetail.update: OrderDetail not found',
          404,
        );
      }

      return result;
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @OrderDetail.update: ${errorMess}`,
        error.statusCode || 500,
      );
    }
  }
}

export default OrderDetail;
