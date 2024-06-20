import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timer } from 'rxjs';
import { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import { listProxy } from 'src/common/utils/proxy.util';

let si = 0;

export const getHost = () => {
  console.log('si', si);

  const [host, port] = listProxy[si].split(':');

  si++;

  if (si === listProxy.length) si = 0;

  console.log({ host, port });

  return { host, port };
};

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async testGet(url: string): Promise<any> {
    console.log('url', url);

    const result = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          console.log('error', error);
          throw 'An error happened!';
        }),
      ),
    );

    // console.log('result', result);

    return result?.data ?? null;
  }

  async get(url: string): Promise<any> {
    const source = axios.CancelToken.source();
    let timerId = null;

    console.log('url', url);

    const res = firstValueFrom(
      this.httpService
        .get(url, {
          httpAgent: getHost(),
          cancelToken: source.token,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log('1. error', error.cause);
            return Promise.resolve('2. ERROR from API');
          }),
        ),
    );

    console.log('res', res);

    const timeout = new Promise((resolve, reject) => {
      timerId = setTimeout(() => {
        source.cancel('1.63 Request timeout');
        resolve('1.63 Request timeout');
      }, 7000);
    });

    try {
      const result = await Promise.race([res, timeout]);
      clearTimeout(timerId); // Clear the timeout if the request succeeds
      return result;
    } catch (error) {
      clearTimeout(timerId); // Clear the timeout in case of an error
      throw error;
    }
  }

  async processRequest(url: string): Promise<any> {
    const res = await this.get(url);

    if (!res?.data) {
      console.log('3. ResponseResult', res);
    }

    if (!res?.data) {
      console.log('4. ResponseResult: No data', res);
      throw new Error('5. No data');
    }

    return res.data;
  }

  async processRetry(url: string, attempt = 0): Promise<any> {
    try {
      const data = await this.processRequest(url);

      return data;
    } catch (err) {
      attempt++;
      if (attempt < 5) {
        console.log('retrying', attempt);
        return await this.processRetry(url, attempt); // Return the result of recursive call
      } else {
        throw new Error('Max retry attempts reached'); // Throw an error instead of returning null
      }
    }
  }
}
