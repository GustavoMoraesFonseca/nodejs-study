import { ErrorsConstants } from '../constants/errors.constants.js'
import { ResponseDto } from '../dto/response.dto.js';
import { StatusCodes } from 'http-status-codes';
import { log } from 'debug';

export function responseMessageHandler(returnedData, successData) {
  const isOk = returnedData != null;
  return {
    status: isOk? StatusCodes.OK : StatusCodes.NOT_FOUND,
    body: new ResponseDto(
      isOk? successData : 'Registro não encontrado',
      null
    )
  };
}

export function exceptionHandler(errors, res) {
  log(errors);
  const errorsMsgs = [];
  errors.forEach(e => {
    errorsMsgs.push(e.message)
  });
  res.status(getStatusCode(errors))
     .json(new ResponseDto(null, errorsMsgs));
}

function getStatusCode(errors) {
  const firstError = errors[0];
  if (firstError.type == ErrorsConstants.REQUIRED_ERROR) {
    return StatusCodes.BAD_REQUEST;
  }
  if (firstError.type == ErrorsConstants.UNIQUE_ERROR) {
    return StatusCodes.CONFLICT;
  }
  return StatusCodes.INTERNAL_SERVER_ERROR;
}
