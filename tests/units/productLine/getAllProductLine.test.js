import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { getAllProductLinesCtrl } from '../../../src/controllers/productLine.controller';
import ProductLine from '../../../src/models/productLine.model';
import { productLineDataMock } from '../../mock_data/productLine.mock';

describe('Test get all ProductLine', async () => {
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

  it('Case: NO query search, getAllCustomerCtrler Successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productLineDataMock]));
    const mockData = () => ({ where });

    Sinon.replace(ProductLine, 'query', mockData);

    const result = await getAllProductLinesCtrl(req, res);

    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [productLineDataMock],
    });
  });

  it('Case: NO query Search, NO productLine found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(ProductLine, 'query', mockData);
    try {
      await getAllProductLinesCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.statusCode).to.be.eql(200);
      expect(error.message).to.eql('No ProductLine found');
    }
  });

  it('Case: NO query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => ({ where });

    Sinon.replace(ProductLine, 'query', mockData);

    try {
      await getAllProductLinesCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @ProductLine.get: Internal Server Error',
      );
    }
  });

  it('Case: Query search, getAllProductLine successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productLineDataMock]));
    const dataProductLine = () => ({ where });

    Sinon.replace(ProductLine, 'query', dataProductLine);

    req = {
      query: {
        productLine: 'Atelier graphique',
      },
    };

    try {
      await getAllProductLinesCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @ProductLine.get: No ProductLine found',
      );
    }
  });

  it('Case: Query search, No ProductLine found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(ProductLine, 'query', mockData);

    req = {
      query: {
        textDescription: 123,
      },
    };

    try {
      await getAllProductLinesCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.statusCode).to.be.eql(200);
      expect(error.message).to.eql('No ProductLine found');
    }
  });

  it('Case: Query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const dataProductLine = () => ({ where });

    Sinon.replace(ProductLine, 'query', dataProductLine);

    req = {
      query: { textDescription: 123 },
    };

    try {
      await getAllProductLinesCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @ProductLine.get: Internal Server Error',
      );
    }
  });
});
