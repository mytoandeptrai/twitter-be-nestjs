declare const _default: () => {
    environment: string;
    production: boolean;
    development: boolean;
    port: string;
    mongo: {
        dbName: string;
        username: string;
        password: string;
        url: string;
    };
    jwt: {
        secret: string;
        exp: number;
    };
};
export default _default;
