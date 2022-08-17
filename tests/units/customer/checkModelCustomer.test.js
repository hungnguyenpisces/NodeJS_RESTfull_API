import { expect } from 'chai';
import Customer from '../../../src/models/customer.model';

describe('Test Customer Model', () => {
  it('Test table name is "customers"', () => {
    const result = Customer.tableName;
    expect(result).to.eql('customers');
  });

  it('Test idColumn is "customerNumber"', () => {
    const result = Customer.idColumn;
    expect(result).to.eql('customerNumber');
  });

  it('Test relationshipMappings is an Obj', () => {
    const result = Customer.relationMappings;
    expect(result).to.be.an('object');
  });
});
