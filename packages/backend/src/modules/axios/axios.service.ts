import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timer } from 'rxjs';
import { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
var tunnel = require('tunnel');

// import { getHost } from './helper';

const list = [
  '42.96.10.104:3128',
  '14.177.236.212:55443',

  '14.161.26.100:8080',
  '123.16.13.146:8080',

  '185.114.137.14:8282',
  '60.246.7.4:8080',

  '103.138.174.150:3128',

  '159.89.193.91:3128',
  '51.75.147.44:3128',
  '51.75.147.43:3128',
  '50.30.47.151:3128',
  '157.7.198.176:1080',

  '113.160.235.248:19132',
];

let si = 0;

export const getHost = () => {
  console.log('si', si);
  const [host, port] = list[si].split(':');
  si++;
  if (si === list.length) si = 0;

  console.log({ host, port });
  return { host, port };
};

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async testGet(url: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(url, {
          httpAgent: getHost(),
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error', error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async get(url: string): Promise<any> {
    const source = axios.CancelToken.source();
    let timerId = null;

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

    const timeout = new Promise((resolve, reject) => {
      timerId = setTimeout(() => {
        // source.cancel('1.63 Request timeout');
        console.log('TIMEEEEE OUTTTT');
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

// let data = null;

// await axios
//   .get(url, {
//     httpAgent: tunnel.httpOverHttp({
//       proxy: {
//         host: '42.96.10.104',
//         port: 3128,
//       },
//     }),
//   })
//   .then((response) => {
//     data = response.data;
//   })
//   .catch((error) => {
//     console.log('error', error);
//     throw 'An error happened!';
//   });
