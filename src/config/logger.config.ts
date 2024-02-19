import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { TransformableInfo } from 'logform';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const formatLog = (info: TransformableInfo) =>
    `${info.timestamp} ${info.level} ${info.context ? [info.context] : ''} ${info.message}`;

export const loggerConfig = WinstonModule.createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.cli(),
                format.splat(),
                format.timestamp({ format: timeFormat }),
                format.printf(formatLog)
            )
        }),
        new transports.DailyRotateFile({
            filename: `logs/%DATE%.error.log`,
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d',
            format: format.combine(format.timestamp({ format: timeFormat }), format.printf(formatLog))
        }),
        // log all levels
        new transports.DailyRotateFile({
            filename: `logs/%DATE%.combined.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d',
            format: format.combine(format.timestamp({ format: timeFormat }), format.printf(formatLog))
        })
    ]
});
