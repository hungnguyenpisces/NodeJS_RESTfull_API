import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { getAllProductsCtrl } from '../../../src/controllers/product.controller';
import Product from '../../../src/models/product.model';
import { productDataMock } from '../../mock_data/product.mock';

describe('Test get all Product', async () => {
  let req = {
    query: {},
  };
  let res;

  before(() => {
    res = {
      status: (code) => {
        return {
          json: (data) => {
            return {
              status: code,
              data,
            };
          },
        };
      },
    };
  });

  afterEach(() => Sinon.restore());

  it('Case: NO query search, getAll Product succesfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productDataMock]));
    const mockData = () => ({ where });

    Sinon.replace(Product, 'query', mockData);

    const result = await getAllProductsCtrl(req, res);

    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [productDataMock],
    });
  });

  it('Case: NO query search, NO product found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(Product, 'query', mockData);

    try {
      await getAllProductsCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.statusCode).to.be.eql(404);
      expect(error.message).to.eql('Product not found');
    }
  });

  it('Case: NO query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => ({ where });

    Sinon.replace(Product, 'query', mockData);

    try {
      await getAllProductsCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql('ERROR @Product.get: Internal Server Error');
    }
  });

  it('Case: Query search, getAll product successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productDataMock]));
    const mockData = () => ({ where });

    Sinon.replace(Product, 'query', mockData);

    req = {
      query: {
        productName: '1969 Harley Davidson Ultimate Chopper11',
      },
    };

    const result = await getAllProductsCtrl(req, res);
    assert(where.called);
    expect(result.data.data[0]).to.eql(productDataMock);
  });

  it('Case: Query search, No Product found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(Product, 'query', mockData);

    req = {
      query: {
        productName: 'Harley Davidson Ultimate Chopper11',
      },
    };

    try {
      await getAllProductsCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.statusCode).to.be.eql(404);
      expect(error.message).to.eql('Product not found');
    }
  });

  it('Case: Query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const dataProduct = () => ({ where });

    Sinon.replace(Product, 'query', dataProduct);

    req = {
      query: {
        productName: '1969 Harley Davidson Ultimate Chopper11',
      },
    };

    try {
      await getAllProductsCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.statusCode).to.be.eql(500);
      expect(error.message).to.eql('ERROR @Product.get: Internal Server Error');
    }
  });
});
