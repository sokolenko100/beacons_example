import setupLogger, { FetchBlobWriter } from 'loglevel-file-logger';
import { Platform } from 'react-native';
import DEVICE_LOG from 'react-native-device-log';
import RNFetchBlob from 'rn-fetch-blob';
const defaultLogger: Log = require('loglevel')
const LOG_PATH = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir) + '/AS_LOG.txt'
const fileWriter = new FetchBlobWriter(LOG_PATH)
fileWriter.ensureFile().then(() => {
    // make linter not to complain about promise not subscribed
})
// setup the file logger
setupLogger({
    log: defaultLogger,
    write: fileWriter.write.bind(fileWriter)
})
// enable all logger levels
defaultLogger.enableAll()
const logger = defaultLogger.getLogger('beacon-logger')

const Log = {
    log: (...logRows) => {
        logger.info(JSON.stringify(logRows))
        return DEVICE_LOG.log(...logRows);
    },
    debug: (...logRows) => {
        logger.info(JSON.stringify(logRows))
        return DEVICE_LOG.log(...logRows);
    },
    info: (...logRows) => {
        logger.info(JSON.stringify(logRows))
        return DEVICE_LOG.log(...logRows);
    },
    error: (...logRows) => {
        logger.info(JSON.stringify(logRows))
        return DEVICE_LOG.log(...logRows);
    },
    fatal: (...logRows) => {
        logger.info(JSON.stringify(logRows))
        return DEVICE_LOG.log(...logRows);
    },
    success: (...logRows) => {
        logger.info(JSON.stringify(logRows))
        return DEVICE_LOG.log(...logRows);
    },
    init: (type, params) => {
        return DEVICE_LOG.init(type, params)
    }

}

export default { Log, LOG_PATH };