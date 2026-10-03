import { createHash } from 'crypto';

/**
 * Llave única por cliente a partir de su correo (para ids de documentos y carpetas).
 *
 * Usa SHA-256 del correo normalizado: dos correos distintos nunca generan la misma llave
 * (antes se reemplazaban los símbolos por "_", y juan.perez@x.com y juan_perez@x.com chocaban).
 * Úsala SIEMPRE que un documento o carpeta pertenezca a un cliente.
 */
export function emailKey(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}
