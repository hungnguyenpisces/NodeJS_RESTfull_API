import Model from '../database';
import Employee from './employee.model';
import Customer from './customer.model';

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'roleNumber';
  }

  static get relationMappings() {
    return {
      employees: {
        relation: Model.HasManyRelation,
        modelClass: Employee,
        join: {
          from: 'roles.roleNumber',
          to: 'employees.roleNumber',
        },
      },
      customers: {
        relation: Model.HasManyRelation,
        modelClass: Customer,
        join: {
          from: 'roles.roleNumber',
          to: 'customers.roleNumber',
        },
      },
    };
  }
}
export default Role;
