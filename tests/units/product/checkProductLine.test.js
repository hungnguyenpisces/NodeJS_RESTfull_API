import { assert, expect } from 'chai';
import Sinon from 'sinon';
import checkProductLine from '../../../src/middlewares/product/checkProductLine';
import ProductLine from '../../../src/models/productLine.model';
import { productLineDataMock } from '../../mock_data/productLine.mock';

describe('Test productLine already exists or not?', () => {
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

  it('Case: ProductLine already exists', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productLineDataMock]));
    const mockQuery = () => ({ where });

    Sinon.replace(ProductLine, 'query', mockQuery);

    req = {
      body: {
        productLine: 'Atelier graphique',
      },
    };

    await checkProductLine(req, res, next);

    assert(where.called);
    assert(where.calledWith(req.body));
    expect(next.calledOnce);
  });

  it('Case: ProductLine not found', async () => {
    const where = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({ where });

    Sinon.replace(ProductLine, 'query', mockQuery);

    req = {
      body: {
        productLine: '232131',
      },
    };

    try {
      await checkProductLine(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body));
      expect(error.message).to.eql('ProductLine not found.');
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
        productLine: 'Atelier graphique',
      },
    };

    try {
      await checkProductLine(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body));
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.equal('Internal Server Error');
    }
  });
});
