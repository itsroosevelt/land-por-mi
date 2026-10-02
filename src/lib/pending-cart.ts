/**
 * Carrito de la tienda pública (/tienda) para visitantes sin cuenta.
 * Para pagar, la persona debe registrarse o iniciar sesión: el carrito se guarda aquí
 * y el portal lo pasa a su propio carrito al entrar (ver PortalContext).
 */
const PENDING_CART_KEY = "pormi_pending_cart";

export function readPendingCart(): string[] {
  try {
    const raw = localStorage.getItem(PENDING_CART_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function savePendingCart(itemIds: string[]) {
  try {
    if (itemIds.length) localStorage.setItem(PENDING_CART_KEY, JSON.stringify(itemIds));
    else localStorage.removeItem(PENDING_CART_KEY);
  } catch {
    // almacenamiento no disponible (modo privado, etc.)
  }
}

export function clearPendingCart() {
  savePendingCart([]);
}

/** A dónde llevar a la persona después de registrarse o iniciar sesión. */
export function getPostLoginPath(): string {
  return readPendingCart().length > 0 ? "/portal/tienda" : "/portal";
}
