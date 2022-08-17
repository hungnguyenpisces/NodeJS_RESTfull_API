import { expect } from 'chai';
import Product from '../../../src/models/product.model';

describe('Test Product Model', () => {
  it('Test table name is "products"', () => {
    const result = Product.tableName;
    expect(result).to.eql('products');
  });

  it('Test idColumn is "productCode"', () => {
    const result = Product.idColumn;
    expect(result).to.eql('productCode');
  });
});
