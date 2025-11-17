/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class RestClientService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(RestClientService.name);

  async get(url: string, params: unknown, accessToken: string) {
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

  async post(url: string, params: any, accessToken: string) {
    this.logger.debug(`POST Request to ${url}`);
    this.logger.debug(`Body: ${JSON.stringify(params, null, 2)}`);
    this.logger.debug(
      `Headers: ${JSON.stringify(
        {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        null,
        2,
      )}`,
    );

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

  async put(url: string, params: any, accessToken: string) {
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

  async delete(url: string, accessToken: string) {
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
