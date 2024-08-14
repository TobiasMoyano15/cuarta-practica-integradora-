import winston from 'winston'
import { objectConfig } from '../Config/db.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1, 
        warning: 2,
        info: 3,
        http: 4,
        debug:5
    },
    colors:{
        fatal: 'bgBrightRed',
        error: 'red', 
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'gray'
    }
}

const developmentLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})
const productionLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

export const logger = (objectConfig.environment === 'DEVELOPMENT') ? developmentLogger : productionLogger

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next()
} 