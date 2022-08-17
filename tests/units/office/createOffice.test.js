import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import { createOfficeCtrl } from '../../../src/controllers/office.controller';
import Office from '../../../src/models/office.model';
import { mockCreated } from '../../mock_data/Office.mock';

let res;
describe('Test function createOffice', () => {
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
  it('Successfully! return created office', async () => {
    const insert = Sinon.fake.returns(Promise.resolve(mockCreated));
    const mockQuery = () => ({
      insert,
    });
    Sinon.replace(Office, 'query', mockQuery);

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
    const result = await createOfficeCtrl(req, res);
    assert(insert.called);
    assert(insert.calledWith(req.body));
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Office created successfully',
      data: mockCreated,
    });
  });
  it('Failure! Create office fail', async () => {
    const insert = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      insert,
    });
    Sinon.replace(Office, 'query', mockQuery);

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
    const result = await createOfficeCtrl(req, res);
    assert(insert.called);
    assert(insert.calledWith(req.body));
    expect(result.status).to.equal(400);
    expect(result.data).to.eql({
      message: 'Create office fail',
      data: [],
    });
  });
  it('ERROR @Office.create: Internal Server Error', async () => {
    const insert = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      insert,
    });
    Sinon.replace(Office, 'query', mockQuery);

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
      await createOfficeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Office.create: Internal Server Error',
      );
    }
  });
});
