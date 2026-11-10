import type { Cart } from "@/features/cart/cart.types";
import type { Product } from "@/features/catalog/products.types";
import { cartTotals } from "@/features/cart/cart.logic";
import { productById } from "@/features/catalog/products.logic";
export interface DemoOrder {
  readonly items: readonly { readonly id: string; readonly name: string; readonly quantity: number; readonly price: number }[];
  readonly totals: Readonly<ReturnType<typeof cartTotals>>;
}
export function checkoutOrder(snapshot: { ready: boolean; items: Cart; products: readonly Product[]; promoCode: string }): DemoOrder | null {
  if (!snapshot.ready || !snapshot.items.length || !snapshot.products.length) return null;
  const items: DemoOrder["items"][number][] = [];
  for (const item of snapshot.items) {
    const product = productById(item.id, snapshot.products);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return null;
    items.push({ id: item.id, name: product.name, quantity: item.quantity, price: product.price });
  }
  return { items, totals: cartTotals(snapshot.items, snapshot.promoCode, snapshot.products) };
}
export type CheckoutValues = { fullName: string; email: string; phone: string; address: string };
export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;
// Same field limits and phone rules as the source schema; no form-library dependency.
export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const name = values.fullName.trim(), email = values.email.trim(), phone = values.phone.trim(), address = values.address.trim();
  if (name.length < 2) errors.fullName = "Enter your full name (at least 2 characters).";
  else if (name.length > 100) errors.fullName = "Use 100 characters or fewer for your name.";
  if (email.length > 254) errors.email = "Use 254 characters or fewer for your email.";
  else if (!/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+\-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/.test(email)) errors.email = "Enter a valid email address.";
  if (phone.length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
  else if (phone.length > 30) errors.phone = "Use 30 characters or fewer for your phone number.";
  else if (!/^[+\d\s().-]+$/.test(phone)) errors.phone = "Use numbers and common phone symbols only.";
  else if (phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
  if (address.length < 8) errors.address = "Enter a shipping address (at least 8 characters).";
  else if (address.length > 500) errors.address = "Use 500 characters or fewer for your address.";
  return errors;
}
