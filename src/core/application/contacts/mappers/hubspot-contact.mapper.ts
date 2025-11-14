import { Contact } from '@core/domain/contacts/contact.entity';
import { HubspotContactRaw } from '../types/hubspot-contact.type';
import {
  trimOrNull,
  trimLowerOrNull,
  toDateOrNull,
  normalizePhone,
} from '@shared/utils/normalizers';

export class HubspotContactMapper {
  static toDomain(raw: HubspotContactRaw): Contact {
    const props = raw.properties ?? {};

    const sourceId = props.hs_object_id ?? raw.id;
    const firstname = trimOrNull(props.firstname);
    const lastname = trimOrNull(props.lastname);
    const email = trimLowerOrNull(props.email);
    const phone = normalizePhone(props.phone);
    const status: 'ACTIVE' | 'ARCHIVED' = raw.archived ? 'ARCHIVED' : 'ACTIVE';
    const sourceUrl = trimOrNull(raw.url);
    const sourceCreatedAt = toDateOrNull(props.createdate);
    const sourceUpdatedAt =
      toDateOrNull(props.hs_lastmodifieddate) ??
      toDateOrNull(raw.updatedAt ?? null);

    return new Contact(
      sourceId,
      email,
      firstname,
      lastname,
      phone,
      status,
      sourceUrl,
      sourceCreatedAt,
      sourceUpdatedAt,
      raw,
    );
  }
}
