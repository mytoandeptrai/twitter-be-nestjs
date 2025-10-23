import { Model } from 'mongoose';
import { UserDocument } from '../entities';
import { QueryOption } from 'tools';
export declare class UserRepository {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    findAll(option: QueryOption, conditions?: any): Promise<UserDocument[]>;
    findById(id: string): Promise<UserDocument | null>;
    findByUserName(userName: string): Promise<UserDocument | null>;
    findByUsernameOrEmail(username: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    updateByUsername(username: string, data: any): Promise<UserDocument | null>;
}
