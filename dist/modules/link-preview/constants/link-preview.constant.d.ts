export declare const NUMBER_OF_MAXIMUM_CACHE = 500;
export declare const NUMBER_OF_MAXIMUM_CACHE_SIZE = 5000;
export declare const TIME_TO_LIVE_CACHE: number;
export declare const options: {
    max: number;
    maxSize: number;
    sizeCalculation: (value: any, key: any) => number;
    ttl: number;
    allowStale: boolean;
    updateAgeOnGet: boolean;
    updateAgeOnHas: boolean;
};
