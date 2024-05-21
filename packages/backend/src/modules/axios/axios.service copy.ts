import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
// import tunnel from 'tunnel';
var tunnel = require('tunnel');
// import { getHost } from './helper';
import { set } from 'mongoose';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const list = [
  '42.96.10.104:3128',
  '14.177.236.212:55443',
  '14.161.26.100:8080',
  '123.16.13.146:8080',
  '42.96.10.104:3128',
];

let si = 0;

export const getHost = () => {
  si++;
  if (si === list.length) si = 0;
  const [host, port] = list[si].split(':');
  return { host, port };
};

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async get(url: string): Promise<any> {
    try {
      const res = firstValueFrom(
        this.httpService
          .get(url, {
            httpAgent: tunnel.httpsOverHttp({
              proxy: getHost(),
            }),
            cancelToken: source.token,
          })
          .pipe(
            catchError((error: AxiosError) => {
              throw new Error("'An error happened!'");
            }),
          ),
      );

      const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Request timeout');
        }, 5000);
      });

      return await Promise.race([res, timeout]);
    } catch (err) {
      throw new Error("'An error happened!'");
    }
  }

  async processRequest(url: string): Promise<any> {
    try {
      const res = await this.get(url);

      console.log('ResponseResult', res);
      return res.data;
    } catch (err) {
      throw new Error("'An error happened!'");
    }
  }

  async processRetry(url: string, attempt = 0): Promise<any> {
    try {
      const data = await this.processRequest(url);
      console.log('success', attempt);
      return data;
    } catch (err) {
      attempt++;
      if (attempt < 5) {
        console.log(attempt);

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
