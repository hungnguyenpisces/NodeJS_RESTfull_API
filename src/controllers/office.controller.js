import _ from 'lodash';
import Office from '../models/office.model';

const getAllOfficesCtrl = async (req, res) => {
  const offices = await Office.get(req.query);

  if (_.isEmpty(offices)) {
    return res.status(200).json({
      message: 'No offices found',
      data: [],
    });
  }

  return res.status(200).json({
    total: offices.length,
    data: offices,
  });
};

const getOfficeWithEmployee = async (req, res) => {
  const office = await Office.getOneRelationsToEmployee(req.params);

  if (_.isEmpty(office)) {
    return res.status(200).json({
      message: 'Office not found',
      data: [],
    });
  }

  return res.status(200).json({
    data: office,
  });
};

const updateOfficeCtrl = async (req, res) => {
  const { officeCode } = req.params;
  const data = req.body;
  const updatedOffice = await Office.update(officeCode, data);

  if (_.isEmpty(updatedOffice)) {
    return res.status(200).json({
      message: 'Office to update not found',
      data: [],
    });
  }

  return res.status(200).json({
    message: 'Office updated successfully',
    data: updatedOffice,
  });
};

const createOfficeCtrl = async (req, res) => {
  const data = req.body;
  const newOffice = await Office.create(data);

  if (_.isEmpty(newOffice)) {
    return res.status(400).json({
      message: 'Create office fail',
      data: [],
    });
  }

  return res.status(200).json({
    message: 'Office created successfully',
    data: newOffice,
  });
};

export {
  getAllOfficesCtrl,
  updateOfficeCtrl,
  createOfficeCtrl,
  getOfficeWithEmployee,
};
