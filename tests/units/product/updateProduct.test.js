import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { updateProductCtrl } from '../../../src/controllers/product.controller';
import Product from '../../../src/models/product.model';
import {
  productDataMock,
  updateProductMockBody,
} from '../../mock_data/product.mock';

describe('Test updateProductCtrl', () => {
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

  afterEach(() => Sinon.restore());

  it('Case: updateProductCtrl successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(productDataMock),
    );
    const dataProduct = () => ({ patchAndFetchById });

    Sinon.replace(Product, 'query', dataProduct);

    req = {
      params: {
        productCode: 'S10_1632132',
      },
      body: updateProductMockBody,
    };

    const result = await updateProductCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith('S10_1632132'));
    expect(result.data.message).to.eql('Product update successfully.');
    expect(result.data.data).to.eql(productDataMock);
  });

  it('Case: Product not found', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const dataProduct = () => ({ patchAndFetchById });

    Sinon.replace(Product, 'query', dataProduct);

    req = {
      params: {
        productCode: '232323',
      },
      body: updateProductMockBody,
    };

    try {
      await updateProductCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith('232323', req.body));
      expect(error.message).to.eql('Product not found.');
    }
  });

  it('Case: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataProduct = () => ({ patchAndFetchById });

    Sinon.replace(Product, 'query', dataProduct);

    req = {
      params: {
        productCode: 'S10_1632132',
      },
      body: updateProductMockBody,
    };

    try {
      await updateProductCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith('S10_1632132', req.body));
      expect(error.message).to.eql(
        'ERROR @Product.update: Internal Server Error',
      );
    }
  });
});
