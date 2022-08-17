import { expect } from 'chai';
import Sinon from 'sinon';
import { softDeleteCtrl } from '../../../src/controllers/product.controller';
import AppError from '../../../src/middlewares/error/AppError';
import Product from '../../../src/models/product.model';
import { updateProductDataMock } from '../../mock_data/product.mock';

describe('Test softDelete Product', () => {
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

  it('Case: softDelete successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updateProductDataMock),
    );
    const mockQuery = () => ({ patchAndFetchById });

    Sinon.replace(Product, 'query', mockQuery);

    req = {
      params: {
        productCode: 'S10_1632132',
      },
    };

    const result = await softDeleteCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Delete all products in stocks.',
      data: updateProductDataMock,
    });
  });

  it('Product Not Found.', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve([]));
    const mockQuery = () => ({ patchAndFetchById });

    Sinon.replace(Product, 'query', mockQuery);

    req = {
      params: {
        productCode: 'S10_1632132',
      },
    };

    try {
      await softDeleteCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal('Product not found.');
    }
  });

  it('Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({ patchAndFetchById });

    Sinon.replace(Product, 'query', mockQuery);

    req = {
      params: {
        productCode: 'S10_1632132',
      },
    };

    try {
      await softDeleteCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Product.update: Internal Server Error',
      );
    }
  });
});
