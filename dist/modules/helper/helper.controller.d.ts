import { ResponseDTO } from 'common';
import { HelperService } from './helper.service';
export declare class HelperController {
    private readonly helperService;
    constructor(helperService: HelperService);
    clearAllData(): Promise<ResponseDTO>;
    getDatabaseInfo(): Promise<ResponseDTO>;
}
