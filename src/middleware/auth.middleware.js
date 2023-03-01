import { ResponseDto } from "../dto/response.dto.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config({ encoding: "UTF-8" });

function verifyToken(token, res, next) {
  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err == null) {
      return next();
    }
    if (err.name == "TokenExpiredError") {
      res
        .status(StatusCodes.FORBIDDEN)
        .json(new ResponseDto(null, ["Token expirado"]));
      return;
    }
    if (err) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json(new ResponseDto(null, ["Token inválido"]));
      return;
    }
  });
}

export class AuthMiddleware {
  constructor(app) {
    app.use("/pokemon", this.verifyTokenMiddleware);
  }

  verifyTokenMiddleware(req, res, next) {
    if (!req.headers.authorization) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new ResponseDto(null, ["Token deve ser informado"]));
      return;
    }

    const [, token] = req.headers.authorization.split(" ");
    verifyToken(token, res, next);
  }
}
