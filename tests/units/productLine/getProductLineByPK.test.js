import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { getProductLineCtrl } from '../../../src/controllers/productLine.controller';
import ProductLine from '../../../src/models/productLine.model';
import { mockFetched } from '../../mock_data/productLine.mock';

describe('Test getProductLineById', () => {
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

  it('Case: getProductLineCtrl successfully', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(mockFetched),
    );
    const dataProduct = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(ProductLine, 'query', dataProduct);

    req = {
      params: {
        productLine: 'nothing',
      },
    };

    const result = await getProductLineCtrl(req, res);

    assert(withGraphFetchedFake.calledOnce);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ data: mockFetched[0] });
  });

  it('Case: ERROR @ProductLine.getByPK: ProductLine not found.', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(Promise.resolve([]));
    const dataProduct = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(ProductLine, 'query', dataProduct);

    req = {
      params: {
        productLine: 'bla',
      },
    };

    try {
      await getProductLineCtrl(req, res);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.message).to.eql('ProductLine not found.');
    }
  });

  it('Case: Internal Server Error', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.reject(new Error()),
    );
    const dataProduct = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(ProductLine, 'query', dataProduct);

    req = {
      params: {
        productLine: 'Atelier graphique',
      },
    };

    try {
      await getProductLineCtrl(req, res);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.message).to.eql(
        'ERROR @ProductLine.getByPK: Internal Server Error',
      );
    }
  });
});
