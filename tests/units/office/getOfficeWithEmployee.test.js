import { expect } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import { getOfficeWithEmployee } from '../../../src/controllers/office.controller';
import Office from '../../../src/models/office.model';
import { mockGraphFetched } from '../../mock_data/Office.mock';

let res;
describe('Test function getOfficeWithEmployee', () => {
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
  it('Successfully! return one Office with Employees', async () => {
    const withGraphFetched = Sinon.fake.returns(
      Promise.resolve(mockGraphFetched),
    );
    const mockQuery = () => ({
      where: () => ({
        withGraphFetched,
      }),
    });
    Sinon.replace(Office, 'query', mockQuery);

    const req = {
      params: {
        officeCode: '6',
      },
    };
    const result = await getOfficeWithEmployee(req, res);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      data: mockGraphFetched[0],
    });
  });
  it('Error when office not found', async () => {
    const withGraphFetched = Sinon.fake.returns(Promise.resolve([]));
    const mockQuery = () => ({
      where: () => ({
        withGraphFetched,
      }),
    });
    Sinon.replace(Office, 'query', mockQuery);

    const req = {
      params: {
        officeCode: '6',
      },
    };
    const result = await getOfficeWithEmployee(req, res);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Office not found',
      data: [],
    });
  });
  it('ERROR @Office.getRelations: Internal Server Error', async () => {
    const withGraphFetched = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      where: () => ({
        withGraphFetched,
      }),
    });
    Sinon.replace(Office, 'query', mockQuery);

    const req = {
      params: {
        officeCode: '6',
      },
    };
    try {
      await getOfficeWithEmployee(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Office.getRelations: Internal Server Error',
      );
    }
  });
});
