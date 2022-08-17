import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import { updateOfficeCtrl } from '../../../src/controllers/office.controller';
import Office from '../../../src/models/office.model';
import { mockUpdate } from '../../mock_data/Office.mock';

let res;
describe('Test function updateOffice', () => {
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
  it('Successfully! return one office updated', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(mockUpdate));
    const mockQuery = () => ({
      patchAndFetchById,
    });

    Sinon.replace(Office, 'query', mockQuery);
    const req = {
      params: {
        officeCode: '1',
      },
      body: {
        officeCode: '1',
        city: 'San Francisco',
        phone: '+1 650 219 4782',
        addressLine1: '100 Market Street',
        addressLine2: 'Suite 300',
        state: 'CA',
        country: 'USA',
        postalCode: '94080',
        territory: 'NA',
      },
    };
    const result = await updateOfficeCtrl(req, res);
    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith('1', req.body));

    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Office updated successfully',
      data: mockUpdate,
    });
  });
  it('Failure! Office not found', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      patchAndFetchById,
    });

    Sinon.replace(Office, 'query', mockQuery);
    const req = {
      params: {
        officeCode: '1',
      },
      body: {
        officeCode: '1',
        city: 'San Francisco',
        phone: '+1 650 219 4782',
        addressLine1: '100 Market Street',
        addressLine2: 'Suite 300',
        state: 'CA',
        country: 'USA',
        postalCode: '94080',
        territory: 'NA',
      },
    };
    const result = await updateOfficeCtrl(req, res);
    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith('1', req.body));

    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Office to update not found',
      data: [],
    });
  });
  it('ERROR @Office.update: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      patchAndFetchById,
    });

    Sinon.replace(Office, 'query', mockQuery);
    const req = {
      params: {
        officeCode: '1',
      },
      body: {
        officeCode: '1',
        city: 'San Francisco',
        phone: '+1 650 219 4782',
        addressLine1: '100 Market Street',
        addressLine2: 'Suite 300',
        state: 'CA',
        country: 'USA',
        postalCode: '94080',
        territory: 'NA',
      },
    };
    try {
      await updateOfficeCtrl(req, res);
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith('1', req.body));
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Office.update: Internal Server Error',
      );
    }
  });
});
