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

    const id = props.hs_object_id ?? raw.id;
    const firstname = trimOrNull(props.firstname);
    const lastname = trimOrNull(props.lastname);
    const email = trimLowerOrNull(props.email);
    const phone = normalizePhone(props.phone);
    const status: 'ACTIVE' | 'ARCHIVED' = raw.archived ? 'ARCHIVED' : 'ACTIVE';
    const url = trimOrNull(raw.url);
    const createdAt = toDateOrNull(props.createdate);
    const updatedAt =
      toDateOrNull(props.hs_lastmodifieddate) ??
      toDateOrNull(raw.updatedAt ?? null);
    const archivedAt = toDateOrNull(raw.archivedAt ?? null);

    return new Contact(
      email,
      firstname,
      lastname,
      phone,
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
