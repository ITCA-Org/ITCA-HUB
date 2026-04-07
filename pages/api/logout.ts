import { AxiosError } from 'axios';
import { serialize } from 'cookie';
import { getErrorMessage } from '@/utils/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { CustomError, ErrorResponseData } from '@/types';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCookie = serialize('itca_hub', JSON.stringify({}), {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: -1,
    });

    res.setHeader('Set-Cookie', [tokenCookie]);

    res.redirect('/auth');
  } catch (error) {
    const { message, statusCode } = getErrorMessage(
      error as AxiosError<ErrorResponseData> | CustomError | Error
    );
    res.status(statusCode).json({ message });
  }
}
