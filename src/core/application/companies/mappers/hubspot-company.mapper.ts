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

    const id = props.hs_object_id ?? raw.id;
    const name = trimOrNull(props.name);
    const domain = trimLowerOrNull(props.domain);
    const phone = normalizePhone(props.phone);
    const city = trimLowerOrNull(props.city);
    const country = trimLowerOrNull(props.country);
    const industry = trimLowerOrNull(props.industry);
    const status: 'ACTIVE' | 'ARCHIVED' = raw.archived ? 'ARCHIVED' : 'ACTIVE';
    const url = trimOrNull(raw.url);
    const createdAt = toDateOrNull(props.createdate);
    const updatedAt =
      toDateOrNull(props.hs_lastmodifieddate) ??
      toDateOrNull(raw.updatedAt ?? null);
    const archivedAt = toDateOrNull(raw.archivedAt ?? null);

    return new Company(
      name,
      domain,
      phone,
      city,
      country,
      industry,
      id,
      status,
      url,
      createdAt,
      updatedAt,
      archivedAt,
      raw,
    );
  }
}
