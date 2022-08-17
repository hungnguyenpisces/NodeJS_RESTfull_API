import Model from '../database';
import Customer from './customer.model';
import AppError from '../middlewares/error/AppError';

class Employee extends Model {
  static get tableName() {
    return 'employees';
  }

  static get idColumn() {
    return 'employeeNumber';
  }

  static get relationMappings() {
    return {
      customers: {
        relation: Model.HasManyRelation,
        modelClass: Customer,
        join: {
          from: 'employees.employeeNumber',
          to: 'customers.salesRepEmployeeNumber',
        },
      },
    };
  }

  static async get(condition) {
    try {
      const result = await Employee.query()
        .select('employees.*', 'users.email')
        .where(condition)
        .join('users', 'employees.userNumber', 'users.userNumber');

      return result;
    } catch (error) {
      throw new AppError('ERROR @Employee.get: Internal Server Error', 500);
    }
  }

  static async getOne(condition) {
    try {
      const result = await Employee.query().where(condition);

      return result[0];
    } catch (error) {
      throw new AppError(`ERROR @Employee.getOne: Internal Server Error`, 500);
    }
  }

  static async getOneRelationsToCustomer(condition) {
    try {
      const result = await Employee.query()
        .select('employees.*', 'users.email')
        .where(condition)
        .join('users', 'employees.userNumber', 'users.userNumber')
        .withGraphFetched('customers');

      return result[0];
    } catch (error) {
      throw new AppError(
        'ERROR @Employee.getRelations: Internal Server Error',
        500,
      );
    }
  }

  static async update(condition, data) {
    try {
      const result = await Employee.query().patchAndFetchById(condition, data);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Employee.update: Internal Server Error`, 500);
    }
  }
}
export default Employee;
