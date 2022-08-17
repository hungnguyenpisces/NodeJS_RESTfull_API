import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { createProductLineCtrl } from '../../../src/controllers/productLine.controller';
import ProductLine from '../../../src/models/productLine.model';
import {
  newProducLineMock,
  productLineDataMock,
} from '../../mock_data/productLine.mock';

describe('Test create ProductLine', async () => {
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

  it('Case:ProductLine create successfully', async () => {
    const insert = Sinon.fake.returns(Promise.resolve(productLineDataMock));
    const mockData = () => ({
      insert,
    });

    Sinon.replace(ProductLine, 'query', mockData);

    req = {
      body: newProducLineMock,
    };

    const result = await createProductLineCtrl(req, res);

    assert(insert.called);
    assert(insert.calledWith(req.body));
    expect(result.data).to.eql({
      message: 'Created',
      data: productLineDataMock,
    });
  });

  it('Case: Create failed', async () => {
    const insert = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({
      insert,
    });

    Sinon.replace(ProductLine, 'query', mockData);

    req = {
      body: {
        newProducLineMock,
      },
    };

    try {
      await createProductLineCtrl(req, res);
    } catch (error) {
      assert(insert.called);
      assert(insert.calledWith(req.body));
      expect(error.message).to.eql('Create failed.');
    }
  });

  it('Case: Internal Server Error', async () => {
    const insert = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => ({
      insert,
    });

    Sinon.replace(ProductLine, 'query', mockData);

    req = {
      body: newProducLineMock,
    };
    try {
      await createProductLineCtrl(req, res);
    } catch (error) {
      assert(insert.called);
      assert(insert.calledWith(req.body));
      expect(error.message).to.eql(
        'ERROR @ProductLine.create: Internal Server Error',
      );
    }
  });
});
