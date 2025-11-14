import { Deal } from '@core/domain/deals/deal.entity';
import { HubspotDealRaw } from '../types/hubspot-deal.type';
import {
  trimOrNull,
  trimLowerOrNull,
  toDateOrNull,
} from '@shared/utils/normalizers';

export class HubspotDealMapper {
  static toDomain(raw: HubspotDealRaw): Deal {
    const props = raw.properties ?? {};

    const id = props.hs_object_id ?? raw.id;
    const dealname = trimOrNull(props.dealname);
    const dealstage = trimLowerOrNull(props.dealstage);
    const closedate = toDateOrNull(props.closedate);
    const amount = trimOrNull(props.amount);
    const status: 'ACTIVE' | 'ARCHIVED' = raw.archived ? 'ARCHIVED' : 'ACTIVE';
    const url = trimOrNull(raw.url);
    const createdAt = toDateOrNull(props.createdate);
    const updatedAt =
      toDateOrNull(props.hs_lastmodifieddate) ??
      toDateOrNull(raw.updatedAt ?? null);

    return new Deal(
      dealname,
      dealstage,
      closedate,
      amount,
      id,
      status,
      url,
      createdAt,
      updatedAt,
      raw,
    );
  }
}
