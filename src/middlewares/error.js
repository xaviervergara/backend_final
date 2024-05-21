import ErrorEnum from '../errors/error.enum.js';

export const errorHandler = async (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case ErrorEnum.INVALID_TYPE_ERROR:
      return res.status(400).send({ error: error.name });

    case ErrorEnum.INVALID_PARAM:
      return res.status(400).send({ error: error.name });

    case ErrorEnum.USER_NOT_FOUND:
      return res.status(404).send({ error: error.name });

    case ErrorEnum.PRODUCT_NOT_FOUND:
      return res.status(404).send({ error: error.name });

    default:
      return res.status(400).send({ error: 'Unhandled error' });
  }
};
