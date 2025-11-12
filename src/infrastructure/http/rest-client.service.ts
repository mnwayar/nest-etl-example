import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class RestClientService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(RestClientService.name);

  async get(url: any, params: any, accessToken: any) {
    return await firstValueFrom(
      this.httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params,
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            this.logger.error(
              `GET ${url} failed`,
              error?.response?.data || error,
            );
            throw new HttpException(
              error.response?.data || 'Error fetching data',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
  }

  async post(url: any, params: any, accessToken: any) {
    return await firstValueFrom(
      this.httpService
        .post(url, params, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            this.logger.error(
              `POST ${url} failed`,
              error?.response?.data || error,
            );
            throw new HttpException(
              error.response?.data || 'Error posting data',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
  }

  async put(url: any, params: any, accessToken: any) {
    return await firstValueFrom(
      this.httpService
        .put(url, params, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            this.logger.error(
              `PUT ${url} failed`,
              error?.response?.data || error,
            );
            throw new HttpException(
              error.response?.data || 'Error updating data',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
  }

  async delete(url: any, accessToken: any) {
    const response = await firstValueFrom(
      this.httpService
        .delete(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            this.logger.error(
              `DELETE ${url} failed`,
              error?.response?.data || error,
            );
            throw new HttpException(
              error.response?.data || 'Error deleting product',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );

    return response;
  }
}
