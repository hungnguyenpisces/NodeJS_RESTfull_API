import Model from '../database';
import AppError from '../middlewares/error/AppError';

class Payment extends Model {
  static get tableName() {
    return 'payments';
  }

  static get idColumn() {
    return 'orderNumber';
  }

  static async getOne(condition) {
    try {
      const result = await Payment.query().where(condition);

      return result[0] || {};
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @Payment.getOne: Internal Server Error`,
        error.statusCode || 500,
      );
    }
  }

  static async update(condition, data) {
    try {
      const result = await Payment.query().patch(data).where(condition);
      if (result === 0) {
        throw new AppError(`Update payment failed`, 500);
      }

      return result;
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @Payment.update: Internal Server Error`,
        error.statusCode || 500,
      );
    }
  }
}
export default Payment;
