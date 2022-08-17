import Sinon from 'sinon';
import { assert, expect } from 'chai';
import { productDataMock } from '../../mock_data/product.mock';
import Product from '../../../src/models/product.model';
import { checkDupProduct } from '../../../src/middlewares/product/validateProduct';

describe('Test function checkDuplicateProduct', () => {
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

  it('Case: Product already exist', async () => {
    const where = Sinon.fake.returns(Promise.resolve([productDataMock]));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(Product, 'query', mockQuery);

    req = {
      body: {
        productCode: 'S10_1632132',
      },
    };

    try {
      await checkDupProduct(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body));
      expect(error.message).to.eql('Product already exists');
    }
  });

  it('Case: Not duplicate', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockQuery = () => ({ where });

    Sinon.replace(Product, 'query', mockQuery);

    req = {
      body: {
        productCode: 'S123312',
      },
    };

    await checkDupProduct(req, res, next);

    assert(where.called);
    assert(where.calledWith(req.body));
    expect(next.calledOnce);
  });

  it('Case: Internal Server error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({ where });

    Sinon.replace(Product, 'query', mockQuery);

    req = {
      body: {
        productCode: 'S123312',
      },
    };

    try {
      await checkDupProduct(req, res, next);
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
