export const NUMBER_OF_MAXIMUM_CACHE = 500;
export const NUMBER_OF_MAXIMUM_CACHE_SIZE = 5000;
export const TIME_TO_LIVE_CACHE = 1000 * 60 * 5;

export const options = {
  max: NUMBER_OF_MAXIMUM_CACHE,

  // for use with tracking overall storage size
  maxSize: NUMBER_OF_MAXIMUM_CACHE_SIZE,
  sizeCalculation: (value, key) => {
    /** 1 is the same size for each key and value */
    return 1;
  },

  ttl: TIME_TO_LIVE_CACHE,
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
};
