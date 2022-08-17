import { assert, expect } from 'chai';
import Sinon from 'sinon';
import productLineDataMock from '../../mock_data/productLine.mock';
import { checkDupProductLine } from '../../../src/middlewares/productLine/validateProductLine';
import ProductLine from '../../../src/models/productLine.model';

describe('Test checkDupProductLines', () => {
  let req;
  let res;
  const next = Sinon.spy();

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

  afterEach(() => {
    Sinon.restore();
  });
  it('Case: ProductLine already exist', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productLineDataMock]));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(ProductLine, 'query', mockQuery);

    req = {
      body: {
        productLine: 'Atelier graphique',
      },
    };
    try {
      await checkDupProductLine(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body));
      expect(error.message).to.eql('ProductLine already exists');
    }
  });
  it('Case: NOT duplicated', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(ProductLine, 'query', mockQuery);

    req = {
      body: {
        productLine: 'bla',
      },
    };
    try {
      await checkDupProductLine(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body));
      expect(next.calledOnce);
    }
  });
  it('Case: Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(ProductLine, 'query', mockQuery);

    req = {
      body: {
        productLine: 'bla',
      },
    };
    try {
      await checkDupProductLine(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body));
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Product.Duplicate: Internal Server Error',
      );
    }
  });
});
