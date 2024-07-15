import { EError } from "../Service/errors/enums.js";

export const handleErrors = (error, req, res, next) => {
        console.log(error.cause);

    
    switch (error.code) {
        case EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR:
            return res.status(400).send({ status: 'error', error: error.cause });

        case EError.INVALID_TYPES_ERROR:
            return res.status(400).send({ status: 'error', error: error.cause });

        default:
            return res.status(400).send({ status: 'error', error: `Error no identificado ${error}` });
    }
}; 




// export const handleErrors = (error, req, res, next) => {
//     console.log(error.cause);

//     const displayFormattedError = JSON.stringify(error, (value) => {
//         if (typeof value === 'string') {
//             return value.split('\n').join('\n');
//         }
//         return value;
//     });

//     switch (error.code) {
//         case EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR:
//         case EError.INVALID_TYPES_ERROR:
//             return res.status(400).json(JSON.parse(displayFormattedError));

//         default:
//             return res.status(500).json(JSON.parse(displayFormattedError));
//     }
// };