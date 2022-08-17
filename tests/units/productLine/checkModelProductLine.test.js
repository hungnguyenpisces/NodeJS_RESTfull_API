import { expect } from 'chai';
import ProductLine from '../../../src/models/productLine.model';

describe('Test ProductLine Model', () => {
  it('Test table name is "productlines"', () => {
    const result = ProductLine.tableName;
    expect(result).to.eql('productlines');
  });

  it('Test idColumn is "productLine"', () => {
    const result = ProductLine.idColumn;
    expect(result).to.eql('productLine');
  });

  it('Test relationshipMappings is an Obj', () => {
    const result = ProductLine.relationMappings;
    expect(result).to.be.an('object');
  });
});
