import Model from '../database';
import Order from './order.model';
import AppError from '../middlewares/error/AppError';

const errorMess = 'Internal Server Error';

class Customer extends Model {
  static get tableName() {
    return 'customers';
  }

  static get idColumn() {
    return 'customerNumber';
  }

  static get relationMappings() {
    return {
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'customers.customerNumber',
          to: 'orders.customerNumber',
        },
      },
    };
  }

  static async get(condition) {
    try {
      const result = await Customer.query().where(condition);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Customer.get: ${errorMess}`, 500);
    }
  }

  static async getOneRelationsToOrder(condition) {
    try {
      const result = await Customer.query()
        .select('customers.*', 'users.email')
        .where(condition)
        .join('users', 'customers.userNumber', 'users.userNumber')
        .withGraphFetched('orders');

      return result[0];
    } catch (error) {
      throw new AppError(
        'ERROR @Customer.getRelations: Internal Server Error',
        500,
      );
    }
  }

  static async update(customerNumber, data) {
    try {
      const result = await Customer.query().patchAndFetchById(
        customerNumber,
        data,
      );

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Customer.update: ${errorMess}`, 500);
    }
  }
}

export default Customer;
