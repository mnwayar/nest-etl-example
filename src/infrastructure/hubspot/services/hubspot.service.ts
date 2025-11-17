/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';

export abstract class HubSpotService<TRaw> {
  protected readonly baseUrl: string;
  protected readonly token: string;
  protected readonly defaultLimit: number;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly restClient: RestClientService,
  ) {
    const baseUrl: string | undefined =
      this.configService.get<string>('hubspot.baseUrl');
    const token: string | undefined =
      this.configService.get<string>('hubspot.token');

    if (!baseUrl || !token) {
      throw new Error('HubSpot configuration is missing');
    }

    this.baseUrl = baseUrl;
    this.token = token;
    this.defaultLimit = this.configService.get<number>('hubspot.limit') ?? 10;
  }

  protected abstract mapItem(item: any): TRaw;

  protected async fetchEntities(
    url: string,
    method: 'get' | 'post',
    params: Record<string, any>,
    limit?: number,
  ): Promise<TRaw[]> {
    const pageSize = limit ?? this.defaultLimit;
    const finalUrl = `${this.baseUrl}${url}`;
    const entities: TRaw[] = [];

    let after: string | undefined = undefined;
    let hasNext: boolean = false;

    params.limit = pageSize;

    do {
      let data: any;
      if (after) params.after = after;

      if (method === 'get') {
        data = await this.restClient.get(finalUrl, params, this.token);
      } else {
        data = await this.restClient.post(finalUrl, params, this.token);
      }

      const results = data.results ?? [];

      for (const item of results) {
        entities.push(this.mapItem(item));
      }

      after = data.paging?.next?.after;
      hasNext = Boolean(after);
    } while (hasNext);

    return entities;
  }
}
