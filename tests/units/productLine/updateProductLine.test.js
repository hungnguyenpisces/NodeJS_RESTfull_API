import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { updateProductLineCtrl } from '../../../src/controllers/productLine.controller';
import AppError from '../../../src/middlewares/error/AppError';
import ProductLine from '../../../src/models/productLine.model';
import { productLineDataMock } from '../../mock_data/productLine.mock';

describe('Test updateProductLineCtrl', () => {
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

  it('Case: updateProductLineCtrl Successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(productLineDataMock),
    );
    const dataProductLine = () => ({ patchAndFetchById });

    Sinon.replace(ProductLine, 'query', dataProductLine);

    req = {
      params: {
        productLine: 'Atelier graphique',
      },
      body: {
        textDescription: 123,
        htmlDescription: 321,
        image: 97,
      },
    };

    const result = await updateProductLineCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith('Atelier graphique', req.body));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Updated',
      data: productLineDataMock,
    });
  });

  it('Case: Update Fail because the updating of ID', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(productLineDataMock),
    );
    const mockQuery = () => ({
      patchAndFetchById,
    });

    Sinon.replace(ProductLine, 'query', mockQuery);

    req = {
      params: {
        productLine: 'Atelier graphique',
      },
      body: {
        productLine: 'Atelier graphique FAKE',
        textDescription: '123',
        htmlDescription: '321',
        image: '97',
      },
    };

    try {
      await updateProductLineCtrl(req, res);
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith('Atelier graphique', req.body));
    } catch (error) {
      expect(error).to.be.an.instanceOf(AppError);
      expect(error.statusCode).to.be.eql(400);
      expect(error.message).to.eql(
        'Cannot change the name of this ProductLine',
      );
    }
  });

  it('Case: ProductLine not found', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const dataProductLine = () => ({ patchAndFetchById });

    Sinon.replace(ProductLine, 'query', dataProductLine);

    req = {
      params: {
        productLine: 'dadasda',
      },
      body: {
        textDescription: 123,
        htmlDescription: 321,
        image: 97,
      },
    };

    try {
      await updateProductLineCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith('dadasda', req.body));
      expect(error.message).to.eql('ProductLine not found');
    }
  });

  it('Case: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataProductLine = () => ({ patchAndFetchById });

    Sinon.replace(ProductLine, 'query', dataProductLine);

    req = {
      params: {
        productLine: 'Atelier graphique',
      },
      body: {
        textDescription: 123,
        htmlDescription: 321,
        image: 97,
      },
    };

    try {
      await updateProductLineCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith('Atelier graphique', req.body));
      expect(error.message).to.eql(
        'ERROR @ProductLine.update: Internal Server Error',
      );
    }
  });
});
