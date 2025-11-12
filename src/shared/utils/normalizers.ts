export const trimOrNull = (v?: string | null): string | null => {
  if (v == null) return null;
  const t = v.trim();
  return t.length ? t : null;
};

export const trimLowerOrNull = (v?: string | null): string | null => {
  const t = trimOrNull(v);
  return t ? t.toLowerCase() : null;
};

export const toDateOrNull = (v?: string | null): Date | null => {
  if (!v) return null;
  return new Date(v);
};

export const normalizePhone = (v?: string | null): string | null => {
  const t = trimOrNull(v);
  if (!t) return null;
  const cleaned = t.replace(/[^\d+]/g, '');
  return cleaned.length ? cleaned : null;
};

export const yearUtcOrNull = (d?: Date | null): number | null =>
  d ? d.getUTCFullYear() : null;
