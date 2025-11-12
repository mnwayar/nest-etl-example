import { Company } from '../../../domain/companies/company.entity';
import { HubspotCompanyRaw } from '../types/hubspot-company.type';
import { trimOrNull, trimLowerOrNull, toDateOrNull } from '../../../../shared/utils/normalizers';


export class HubspotCompanyMapper {
  static toDomain(raw: HubspotCompanyRaw): Company {
    const props = raw.properties ?? {};

    const sourceId = props.hs_object_id ?? raw.id;
    const name = trimOrNull(props.name);
    const websiteDomain = trimLowerOrNull(props.domain);
    const status: 'ACTIVE' | 'ARCHIVED' = raw.archived ? 'ARCHIVED' : 'ACTIVE';
    const sourceCreatedAt = toDateOrNull(props.createdate);
    const sourceUpdatedAt =
      toDateOrNull(props.hs_lastmodifieddate) ??
      toDateOrNull(raw.updatedAt ?? null);

    return new Company(
      sourceId,
      name,
      websiteDomain,
      status,
      sourceCreatedAt,
      sourceUpdatedAt,
      raw,
    );
  }
}
