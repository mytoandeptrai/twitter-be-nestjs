import { Connection } from 'mongoose';
import { ResponseDTO } from 'common';
export declare class HelperService {
    private connection;
    constructor(connection: Connection);
    clearAllData(): Promise<ResponseDTO>;
    getDatabaseInfo(): Promise<ResponseDTO>;
}
