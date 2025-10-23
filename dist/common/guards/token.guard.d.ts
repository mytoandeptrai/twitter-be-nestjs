declare const MyTokenAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class MyTokenAuthGuard extends MyTokenAuthGuard_base {
    handleRequest(err: any, user: any, info: Error): any;
}
export {};
