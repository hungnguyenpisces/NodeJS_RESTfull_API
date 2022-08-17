import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import Office from '../../../src/models/office.model';
import { checkDuplicateOffice } from '../../../src/middlewares/office/validateOffice';
import { mockCreated } from '../../mock_data/Office.mock';

let res;
describe('Test function checkDuplicateOffice', () => {
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
  it('throw Error "officeCode already exist"', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(mockCreated));
    const mockQuery = () => ({
      findById,
    });
    Sinon.replace(Office, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        officeCode: '7',
        city: 'London',
        phone: '+44 20 7877 2041',
        addressLine1: '25 Old Broad Street',
        addressLine2: 'Level 7',
        state: null,
        country: 'UK',
        postalCode: 'EC2N 1HN',
        territory: 'EMEA',
      },
    };
    try {
      await checkDuplicateOffice(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(findById.called);
      assert(findById.calledWith(req.body.officeCode));
      expect(error.message).to.equal('officeCode is already exist');
    }
  });
  it('next() called when officeCode is not exist', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      findById,
    });
    Sinon.replace(Office, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        officeCode: '7',
        city: 'London',
        phone: '+44 20 7877 2041',
        addressLine1: '25 Old Broad Street',
        addressLine2: 'Level 7',
        state: null,
        country: 'UK',
        postalCode: 'EC2N 1HN',
        territory: 'EMEA',
      },
    };
    await checkDuplicateOffice(req, res, next);
    assert(findById.called);
    assert(findById.calledWith(req.body.officeCode));
    assert(next.calledOnce);
  });
  it('ERROR @Office.Duplicate: Internal Server Error', async () => {
    const findById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      findById,
    });
    Sinon.replace(Office, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        officeCode: '7',
        city: 'London',
        phone: '+44 20 7877 2041',
        addressLine1: '25 Old Broad Street',
        addressLine2: 'Level 7',
        state: null,
        country: 'UK',
        postalCode: 'EC2N 1HN',
        territory: 'EMEA',
      },
    };
    try {
      await checkDuplicateOffice(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(findById.called);
      assert(findById.calledWith(req.body.officeCode));
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Office.Duplicate: Internal Server Error',
      );
    }
  });
});
