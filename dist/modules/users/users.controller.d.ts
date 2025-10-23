import { ResponseDTO } from 'common';
import { QueryPostOption } from 'tools';
import { FollowAnonymousDto, RegisterUserDTO, UpdateUserDTO, UserDTO } from './dto';
import { User, UserDocument } from './entities';
import { UsersService } from './users.service';
export declare class UserController {
    private userService;
    constructor(userService: UsersService);
    createUser(user: RegisterUserDTO): Promise<ResponseDTO>;
    followUser(user: UserDocument, userToFollowId: string): Promise<ResponseDTO>;
    unFollowUser(user: UserDocument, userToUnFollowId: string): Promise<ResponseDTO>;
    followAnonymous(body: FollowAnonymousDto): Promise<ResponseDTO>;
    updateMyProfile(oldUser: any, newUserInfo: UpdateUserDTO): Promise<ResponseDTO>;
    updateBanStatusOfUser(requestUser: UserDocument, body: {
        status: string;
    }, userId: string): Promise<ResponseDTO>;
    updateUserById(requestUser: UserDocument, userInfo: UserDTO, userId: string): Promise<ResponseDTO>;
    reportTweet(userId: string): Promise<ResponseDTO>;
    getUsers(query: QueryPostOption): Promise<ResponseDTO>;
    getMyProfile(user: User): Promise<ResponseDTO>;
    getPopularUsers(user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    getUserById(userId: string): Promise<ResponseDTO>;
    getUserByIdAdmin(userId: string): Promise<ResponseDTO>;
}
