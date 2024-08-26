import {Router} from 'express';
import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { authorizationJwt} from '../../src/util/authorizationJwt.js';
import { passport } from '../../src/util/passportCall.js';
import swaggerOptions from "../../src/Config/swaggerConfig.js";

const router = Router();

const specs = swaggerJsDocs(swaggerOptions);

router.use('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

export default router;