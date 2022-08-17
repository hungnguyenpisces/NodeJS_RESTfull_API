import Model from '../database';
import Employee from './employee.model';
import AppError from '../middlewares/error/AppError';

class Office extends Model {
  static get tableName() {
    return 'offices';
  }

  static get idColumn() {
    return 'officeCode';
  }

  static get relationMappings() {
    return {
      employees: {
        relation: Model.HasManyRelation,
        modelClass: Employee,
        join: {
          from: 'offices.officeCode',
          to: 'employees.officeCode',
        },
      },
    };
  }

  static async get(condition) {
    try {
      const result = await Office.query().where(condition);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Office.get: Internal Server Error`, 500);
    }
  }

  static async getOneRelationsToEmployee(condition) {
    try {
      const result = await Office.query()
        .where(condition)
        .withGraphFetched('employees');

      return result[0];
    } catch (error) {
      throw new AppError(
        `ERROR @Office.getRelations: Internal Server Error`,
        500,
      );
    }
  }

  static async update(condition, data) {
    try {
      const result = await Office.query().patchAndFetchById(condition, data);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Office.update: Internal Server Error`, 500);
    }
  }

  static async create(data) {
    try {
      const result = await Office.query().insert(data);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Office.create: Internal Server Error`, 500);
    }
  }
}
export default Office;
