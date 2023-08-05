import { HttpException, HttpStatus } from '@nestjs/common';
export const ResponseMessage = (
  error: string,
  status: keyof typeof HttpStatus,
) => {
  throw new HttpException(
    {
      error,
    },
    HttpStatus[status],
  );
};
