import { expect } from 'chai';
import Order from '../../../src/models/order.model';

describe('Test Order Model', () => {
  it('Test table name is "orders"', () => {
    const result = Order.tableName;
    expect(result).to.eql('orders');
  });

  it('Test idColumn is "orderNumber"', () => {
    const result = Order.idColumn;
    expect(result).to.eql('orderNumber');
  });

  it('Test relationshipMappings is an Obj', () => {
    const result = Order.relationMappings;
    expect(result).to.be.an('Object');
  });
});
