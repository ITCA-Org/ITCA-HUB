import { CustomError, ErrorResponseData } from "@/types";
import { AxiosError } from "axios";

//Testing the error handling function with different error types
export const getErrorMessage = (err: AxiosError<ErrorResponseData> | CustomError | Error) => {
  const response = (err as AxiosError<ErrorResponseData>).response;
  
  if (response) {
    const {data, status} = response;

    if (data) {
      return {
        statusCode: (err as CustomError)?.statusCode ?? status,
        message: data.message ?? 'An error occurred. Please try again later.',
      }
    }
  }

  return {
    statusCode: (err as CustomError)?.statusCode ?? 500,
    message: err.message ?? 'An error occurred. Please try again later.'
  }
}