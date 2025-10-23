declare const MyAdminTokenAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class MyAdminTokenAuthGuard extends MyAdminTokenAuthGuard_base {
    handleRequest(err: any, user: any, info: Error): any;
}
export {};
