import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import { getAllOfficesCtrl } from '../../../src/controllers/office.controller';
import Office from '../../../src/models/office.model';
import { mockGetAll } from '../../mock_data/Office.mock';

let res;
describe('Test function getAllOffices', () => {
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
  it('Successfully! return all offices', async () => {
    const where = Sinon.fake.returns(Promise.resolve(mockGetAll));
    const mockQuery = () => ({
      where,
    });
    Sinon.replace(Office, 'query', mockQuery);

    const req = {};
    const result = await getAllOfficesCtrl(req, res);
    assert(where.called);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      total: 7,
      data: mockGetAll,
    });
  });

  it('Error when offices not found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockQuery = () => ({
      where,
    });
    Sinon.replace(Office, 'query', mockQuery);
    const req = {};
    const result = await getAllOfficesCtrl(req, res);
    assert(where.called);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'No offices found',
      data: [],
    });
  });

  it('ERROR @Office.get: Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      where,
    });
    Sinon.replace(Office, 'query', mockQuery);
    const req = {};
    try {
      await getAllOfficesCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(where.called);
      expect(error.message).to.eql('ERROR @Office.get: Internal Server Error');
    }
  });
});
