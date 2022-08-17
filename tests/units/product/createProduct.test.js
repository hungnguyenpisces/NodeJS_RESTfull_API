import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { createProductCtrl } from '../../../src/controllers/product.controller';
import Product from '../../../src/models/product.model';
import { newProductMock, productDataMock } from '../../mock_data/product.mock';

describe('Test create Product', async () => {
  let req;
  let res;

  before(() => {
    req = {};
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

  it('Case: Product create successfully', async () => {
    const insert = Sinon.fake.returns(Promise.resolve(productDataMock));
    const mockData = () => ({ insert });

    Sinon.replace(Product, 'query', mockData);

    req = {
      body: newProductMock,
    };

    const result = await createProductCtrl(req, res);

    assert(insert.called);
    assert(insert.calledWith(req.body));
    expect(result.data.message).to.equal('Product created successfully');
    expect(result.data.data).to.eql(productDataMock);
  });

  it('Case: Create failed', async () => {
    const insert = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ insert });

    Sinon.replace(Product, 'query', mockData);

    req = {
      body: newProductMock,
    };

    try {
      await createProductCtrl(req, res);
    } catch (error) {
      assert(insert.called);
      assert(insert.calledWith(req.body));
      expect(error.message).to.eql('ERROR @Product.create: Create failed');
    }
  });

  it('Case: Internal server error', async () => {
    const insert = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => ({ insert });

    Sinon.replace(Product, 'query', mockData);

    req = {
      body: newProductMock,
    };

    try {
      await createProductCtrl(req, res);
    } catch (error) {
      assert(insert.called);
      assert(insert.calledWith(req.body));
      expect(error.message).to.eql(
        'ERROR @Product.create: Internal Server Error',
      );
    }
  });
});
