import { expect } from 'chai';
import OrderDetail from '../../../src/models/orderDetail.model';

describe('Test OrderDetail Model', () => {
  it('Test table name is "orderdetails"', () => {
    const result = OrderDetail.tableName;
    expect(result).to.eql('orderdetails');
  });

  it('Test idColumn is "orderNumber, producCode"', () => {
    const result = OrderDetail.idColumn;
    expect(result).to.eql(['orderNumber', 'producCode']);
  });
});
