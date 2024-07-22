import { EError } from "../Service/errors/enums.js";
import { logger } from "../util/logger.js";

export const handleErrors = (error, req, res, next) => {
    logger.error(error.cause);

    switch (error.code) {
        case EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR:
            return res.status(400).send({ status: 'error', error: error.cause });

        case EError.INVALID_TYPES_ERROR:
            return res.status(400).send({ status: 'error', error: error.cause });

        default:
            return res.status(400).send({ status: 'error', error: `Error no identificado ${error}` });
    }
};