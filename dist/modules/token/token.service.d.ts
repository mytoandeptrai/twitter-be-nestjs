import { Model } from 'mongoose';
import { TokenDocument } from './entities';
export declare class TokenService {
    private tokenModel;
    constructor(tokenModel: Model<TokenDocument>);
    private JWTKey;
    setJWTKey(userID: string, jti: string, duration: number, timestamp: number): Promise<void>;
    checkJWTKey(userID: string, jti: string): Promise<boolean>;
    deleteJWTKey(userID: string, jti: string): Promise<number>;
    deleteJWTKeysCreatedBeforeDate(threshold: number): Promise<number | undefined>;
    deleteExpiredJWTKeys(): Promise<number | undefined>;
    deleteJWTKeysByUserID(userID: string): Promise<number | undefined>;
}
