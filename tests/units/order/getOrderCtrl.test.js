import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { getOrderCtrl } from '../../../src/controllers/order.controller';
import Order from '../../../src/models/order.model';
import User from '../../../src/models/user.model';
import Employee from '../../../src/models/employee.model';
import { ordersMock } from '../../mock_data/order.mock';

describe('Test getOrderCtrl', () => {
  let req;
  let res;

  afterEach(() => Sinon.restore());

  it('Role customer, getOrderCtrl successfully', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
    );
    const userFakeRelate = Sinon.fake.returns({
      email: 'abc@gmail.com',
      customer: {
        customerNumber: 10,
      },
    });
    const orderFakeGetOne = Sinon.fake.returns({
      orderNumber: 200,
      orderDate: '2003-01-08',
      requiredDate: '2003-01-08',
      shippedDate: '2003-01-08',
      status: 'Shipped',
      comments: '',
      customerNumber: 10,
    });

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'getOneRelatedToCustomer', userFakeRelate);
    Sinon.replace(Order, 'getOne', orderFakeGetOne);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
    };
    res = {
      locals: {
        user: {
          roleNumber: 4,
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      data: {
        orderNumber: 200,
        orderDate: '2003-01-08',
        requiredDate: '2003-01-08',
        shippedDate: '2003-01-08',
        status: 'Shipped',
        comments: '',
        customerNumber: 10,
      },
    });
  });

  it('Role customer, error: Your data could not be found, please contact us', async () => {
    const userFakeRelate = Sinon.fake.returns({
      email: 'abc@gmail.com',
      customer: {},
    });

    Sinon.replace(User, 'getOneRelatedToCustomer', userFakeRelate);

    req = {
      params: {
        orderNumber: 10,
      },
    };
    res = {
      locals: {
        user: {
          roleNumber: 4,
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(500);
    expect(result.data).to.eql({
      message: 'Your data could not be found, please contact us',
    });
  });

  it('Role customer, error: Not Found', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
    );
    const userFakeRelate = Sinon.fake.returns({
      email: 'abc@gmail.com',
      customer: {
        customerNumber: 99,
      },
    });

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'getOneRelatedToCustomer', userFakeRelate);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
    };
    res = {
      locals: {
        user: {
          roleNumber: 4,
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(404);
    expect(result.data).to.eql({
      message: 'Not Found',
    });
  });

  it('Role staff, getOrderCtrl successfully', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
    );
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
    const orderFakeGetOne = Sinon.fake.returns({
      orderNumber: 200,
      orderDate: '2003-01-08',
      requiredDate: '2003-01-08',
      shippedDate: '2003-01-08',
      status: 'Shipped',
      comments: '',
      customerNumber: 10,
    });

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Employee, 'getOneRelationsToCustomer', employeeFakeRelate);
    Sinon.replace(Order, 'getOne', orderFakeGetOne);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      data: {
        orderNumber: 200,
        orderDate: '2003-01-08',
        requiredDate: '2003-01-08',
        shippedDate: '2003-01-08',
        status: 'Shipped',
        comments: '',
        customerNumber: 10,
      },
    });
  });

  it(`Role staff, 200: You don't have any customers`, async () => {
    const employeeFakeRelate = Sinon.fake.returns({
      email: 'abc@gmail.com',
      customers: [],
    });

    Sinon.replace(Employee, 'getOneRelationsToCustomer', employeeFakeRelate);

    req = {
      params: {
        orderNumber: 10,
      },
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: `You don't have any customers`,
    });
  });

  it('Role staff, Order not found', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
    );
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
    const orderFakeGetOne = Sinon.fake.returns({
      orderNumber: 200,
      orderDate: '2003-01-08',
      requiredDate: '2003-01-08',
      shippedDate: '2003-01-08',
      status: 'Shipped',
      comments: '',
      customerNumber: 10,
    });

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Employee, 'getOneRelationsToCustomer', employeeFakeRelate);
    Sinon.replace(Order, 'getOne', orderFakeGetOne);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 12,
      },
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ message: 'Order not found' });
  });

  it('Role manager, getOrderCtrl successfully', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
    );

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
    };
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      data: ordersMock[0],
    });
  });

  it('Role admin, getOrderCtrl successfully', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
    );

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
    };
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      data: ordersMock[0],
    });
  });

  it('Case: Order not found', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(Promise.resolve({}));

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
    };
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

    const result = await getOrderCtrl(req, res);

    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Order not found',
    });
  });

  it('Case: ERROR @Order.getOne: Internal Server Error', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.reject(new Error()),
    );

    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 10,
      },
    };
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

    try {
      await getOrderCtrl(req, res);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.message).to.eql('ERROR @Order.getOne: Something went wrong');
    }
  });
});
