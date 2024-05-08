import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async get(url: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          console.log('error', error);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
