export declare const MSG: {
    FRONTEND: {
        AUTH_FAILED: string;
        USERNAME_NOTFOUND: string;
        AUTH_FAILED_WRONG_PASSWORD: string;
        DUPLICATED_USERNAME: string;
        INVALID_USERNAME: string;
        DUPLICATED_EMAIL: string;
        EMAIL_NOT_FOUND: string;
        INACTIVE_EMAIL: string;
        WRONG_PASSWORD: string;
        TOO_MANY_REQUEST: string;
        USER_NOT_FOUND: string;
        UN_AUTHORIZED: string;
        ACTIVE_USER: {
            ERROR: string;
            TOKEN_INVALID: string;
            EMAIL_VERIFIED: string;
            EMAIL_VERIFY_SUCCESS: string;
            SUCCESS: string;
            EXPIRY: string;
        };
    };
    RESPONSE: {
        GET_REQUEST_OK: string;
        POST_REQUEST_OK: string;
        PUT_REQUEST_OK: string;
        PATCH_REQUEST_OK: string;
        DELETE_REQUEST_OK: string;
        CREATED: string;
        REQUEST_GET_FAIL: string;
        POST_REQUEST_FAIL: string;
        PUT_REQUEST_FAIL: string;
        PATCH_REQUEST_FAIL: string;
        DELETE_REQUEST_FAIL: string;
        DUPLICATED: string;
        PROCESSING: string;
        BAD_REQUEST: string;
        INTERNAL_SERVER_ERROR: string;
    };
    UPLOAD: {
        IMAGE_FILE_TYPE_ONLY: string;
        DOCUMENT_FILE_TYPE_ONLY: string;
    };
};
export declare enum EGender {
    MALE = 0,
    FEMALE = 1,
    UNKNOWN = 2
}
export declare enum EAudience {
    PUBLIC = 0,
    FOLLOWERS = 1,
    ONLY_ME = 2
}
export declare const EGenderConstant: {
    MALE: number;
    FEMALE: number;
    UNKNOWN: number;
};
export declare const EAudienceConstant: {
    PUBLIC: number;
    FOLLOWERS: number;
    ONLY_ME: number;
};
