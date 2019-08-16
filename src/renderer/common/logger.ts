import * as log from 'loglevel';
import { context } from './context';

export const logger = {
    init() {
        return new Promise<void>((resolve) => {
            log.setLevel(context.logLevel as any);
            resolve();
        });
    }
}