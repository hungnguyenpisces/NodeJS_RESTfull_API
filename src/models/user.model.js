// import _ from 'lodash';
import Model from '../database';
import Employee from './employee.model';
import Customer from './customer.model';
import AppError from '../middlewares/error/AppError';

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'userNumber';
  }

  static get relationMappings() {
    return {
      employee: {
        relation: Model.BelongsToOneRelation,
        modelClass: Employee,
        join: {
          from: 'users.userNumber',
          to: 'employees.userNumber',
        },
      },
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'users.userNumber',
          to: 'customers.userNumber',
        },
      },
    };
  }

  static async get(condition) {
    try {
      const result = await User.query().where(condition);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @User.get: Internal Server Error`, 500);
    }
  }

  // static async getOne(condition) {
  //   try {
  //     const result = await User.query().where(condition);
  //     if (result.length <= 0) {
  //       throw new AppError(`User not found.`, 404);
  //     }
  //     return result[0];
  //   } catch (error) {
  //     throw new AppError(
  //       error.message
  //         ? error.message
  //         : `ERROR @User.getOne: Internal Server Error`,
  //       error.statusCode || 500,
  //     );
  //   }
  // }

  static async getOneRelatedToCustomer(condition) {
    try {
      const result = await User.query()
        .where(condition)
        .withGraphFetched('customer');

      return result[0] || {};
    } catch (error) {
      throw new AppError(
        error.message ||
          `ERROR @User.getOneRelatedToCustomer: Internal Server Error`,
        error.statusCode || 500,
      );
    }
  }

  static async getOneRelatedToEmployee(condition) {
    try {
      const result = await User.query()
        .where(condition)
        .withGraphFetched('employee');

      return result[0] || {};
    } catch (error) {
      throw new AppError(
        error.message ||
          `ERROR @User.getOneRelatedToEmployee: Internal Server Error`,
        error.statusCode || 500,
      );
    }
  }

  // static async create(data) {
  //   try {
  //     const result = await User.query().insert(data);
  //     if (_.isEmpty(result)) {
  //       throw new AppError(`Create user failed.`, 500);
  //     }
  //   } catch (error) {
  //     throw new AppError(
  //       error.message
  //         ? error.message
  //         : `ERROR @User.create: Internal Server Error`,
  //       error.statusCode || 500,
  //     );
  //   }
  // }

  static async update(condition, data) {
    try {
      const result = await User.query().patch(data).where(condition);
      if (result === 0) {
        throw new AppError(`Update user failed.`, 500);
      }

      return result;
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @User.update: Internal Server Error`,
        error.statusCode || 500,
      );
    }
  }

  // static async delete(condition) {
  //   try {
  //     const result = await User.query().delete().where(condition);
  //     if (result === 0) {
  //       throw new AppError(`Delete user failed.`, 500);
  //     }
  //     return result;
  //   } catch (error) {
  //     throw new AppError(
  //       error.message
  //         ? error.message
  //         : `ERROR @User.delete: Internal Server Error`,
  //       error.statusCode || 500,
  //     );
  //   }
  // }
}
export default User;
