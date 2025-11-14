import { Company } from '@core/domain/companies/company.entity';
import { HubspotCompanyRaw } from '../types/hubspot-company.type';
import {
  trimOrNull,
  trimLowerOrNull,
  toDateOrNull,
  normalizePhone,
} from '@shared/utils/normalizers';

export class HubspotCompanyMapper {
  static toDomain(raw: HubspotCompanyRaw): Company {
    const props = raw.properties ?? {};

    const sourceId = props.hs_object_id ?? raw.id;
    const name = trimOrNull(props.name);
    const websiteDomain = trimLowerOrNull(props.domain);
    const phone = normalizePhone(props.phone);
    const city = trimLowerOrNull(props.city);
    const country = trimLowerOrNull(props.country);
    const industry = trimLowerOrNull(props.industry);
    const status: 'ACTIVE' | 'ARCHIVED' = raw.archived ? 'ARCHIVED' : 'ACTIVE';
    const sourceUrl = trimOrNull(raw.url);
    const sourceCreatedAt = toDateOrNull(props.createdate);
    const sourceUpdatedAt =
      toDateOrNull(props.hs_lastmodifieddate) ??
      toDateOrNull(raw.updatedAt ?? null);

    return new Company(
      sourceId,
      name,
      websiteDomain,
      phone,
      city,
      country,
      industry,
      status,
      sourceUrl,
      sourceCreatedAt,
      sourceUpdatedAt,
      raw,
    );
  }
}
