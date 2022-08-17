import Sinon from 'sinon';
import { expect } from 'chai';
import { getAllOrdersCtrl } from '../../../src/controllers/order.controller';
import Order from '../../../src/models/order.model';
import Employee from '../../../src/models/employee.model';

describe('Test get all orders', async () => {
  let req = {
    query: {},
  };
  let res;

  afterEach(() => Sinon.restore());

  it('Role staff, getAllOrdersCtrl successfully', async () => {
    const employeeFakeRelate = Sinon.fake.returns({
      email: 'abc@gmail.com',
      customers: [
        {
          customerNumber: 10,
        },
        {
          customerNumber: 11,
        },
      ],
    });
    const whereFake = Sinon.fake.returns(
      Promise.resolve([{ orderNumber: 1, status: 'Shipped' }]),
    );
    const mockData = () => {
      return {
        whereIn: () => {
          return {
            where: whereFake,
          };
        },
      };
    };

    Sinon.replace(Employee, 'getOneRelationsToCustomer', employeeFakeRelate);
    Sinon.replace(Order, 'query', mockData);

    req = {
      query: { status: 'Shipped' },
    };
    res = {
      locals: {
        user: {
          roleNumber: 3,
        },
      },
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

    const result = await getAllOrdersCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [{ orderNumber: 1, status: 'Shipped' }],
    });
  });

  it(`Role staff, 200: You don't have any customers`, async () => {
    const employeeFakeRelate = Sinon.fake.returns({});

    Sinon.replace(Employee, 'getOneRelationsToCustomer', employeeFakeRelate);

    res = {
      locals: {
        user: {
          roleNumber: 3,
        },
      },
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

    const result = await getAllOrdersCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: `You don't have any customers`,
    });
  });

  it('Role manager: No Orders found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(Order, 'query', mockData);

    res = {
      locals: {
        user: {
          roleNumber: 2,
        },
      },
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

    const result = await getAllOrdersCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'No Orders found',
    });
  });

  it('Role admin: getAllOrdersCtrl successfully', async () => {
    const where = Sinon.fake.returns(
      Promise.resolve([{ orderNumber: 1, status: 'Shipped' }]),
    );
    const mockData = () => ({ where });

    Sinon.replace(Order, 'query', mockData);

    res = {
      locals: {
        user: {
          roleNumber: 1,
        },
      },
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

    const result = await getAllOrdersCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [{ orderNumber: 1, status: 'Shipped' }],
    });
  });

  it('ERROR @Order.getManyByOrderNumber: Internal Server Error', async () => {
    const employeeFakeRelate = Sinon.fake.returns({
      email: 'abc@gmail.com',
      customers: [
        {
          customerNumber: 10,
        },
        {
          customerNumber: 11,
        },
      ],
    });
    const whereFake = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => {
      return {
        findByIds: () => {
          return {
            where: whereFake,
          };
        },
      };
    };

    Sinon.replace(Employee, 'getOneRelationsToCustomer', employeeFakeRelate);
    Sinon.replace(Order, 'query', mockData);

    res = {
      locals: {
        user: {
          roleNumber: 3,
        },
      },
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

    try {
      await getAllOrdersCtrl(req, res);
    } catch (error) {
      expect(error.message).to.eql(
        'ERROR @Order.getManyByOrderNumber: Internal Server Error',
      );
    }
  });

  it('ERROR @Order.get: Something went wrong', async () => {
    const whereFake = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => {
      return {
        findByIds: () => {
          return {
            where: whereFake,
          };
        },
      };
    };
    Sinon.replace(Order, 'query', mockData);

    res = {
      locals: {
        user: {
          roleNumber: 2,
        },
      },
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

    try {
      await getAllOrdersCtrl(req, res);
    } catch (error) {
      expect(error.message).to.eql('ERROR @Order.get: Something went wrong');
    }
  });
});
