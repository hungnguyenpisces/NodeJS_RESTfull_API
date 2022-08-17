import { expect } from 'chai';
import Employee from '../../../src/models/employee.model';

describe('Test Employee Model', () => {
  it('tableName is "employees"', async () => {
    const result = Employee.tableName;
    expect(result).to.eql('employees');
  });
  it('idColumn ís "employeeNumber"', async () => {
    const result = Employee.idColumn;
    expect(result).to.eql('employeeNumber');
  });
  it('relationMappings is an object', async () => {
    const result = Employee.relationMappings;
    expect(result).to.be.an('object');
  });
});
