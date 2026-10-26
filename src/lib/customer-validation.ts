import { z } from "zod";

// Matches any Unicode letter (Latin, Khmer script, etc.) — used to reject
// "names"/addresses that are purely symbols or emoji, like a prank order's
// gibberish input, while still accepting real names typed in Khmer.
const hasLetter = /\p{L}/u;

function digitsOnly(raw: string) {
  return raw.replace(/\D/g, "");
}

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(100, "That name looks too long")
  .refine((v) => hasLetter.test(v), "Please enter a real name");

// Cambodian mobile numbers are 8-9 national digits, optionally written with a
// +855/855/0 prefix. Strips the same way normalizePhone (lib/meta-pixel.ts)
// does so anything that passes here also normalizes cleanly there, and
// rejects all-one-digit numbers ("111111111") — a common fake-order pattern.
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter your phone number")
  .refine((raw) => {
    let digits = digitsOnly(raw);
    if (digits.startsWith("855")) digits = digits.slice(3);
    else if (digits.startsWith("0")) digits = digits.slice(1);
    return digits.length >= 8 && digits.length <= 9 && !/^(\d)\1+$/.test(digits);
  }, "Please enter a valid Cambodian phone number");

export const addressSchema = z
  .string()
  .trim()
  .min(5, "Please enter your full address")
  .max(500, "That address looks too long")
  .refine((v) => hasLetter.test(v), "Please enter a real address");

export const citySchema = z
  .string()
  .trim()
  .min(2, "Please enter your city")
  .max(100, "That city name looks too long")
  .refine((v) => hasLetter.test(v), "Please enter a real city");

export type CustomerValidationError = {
  field: "customer_name" | "customer_phone" | "address" | "city";
  message: string;
};

// Shared by the checkout form (client-side, for instant feedback) and
// createOrder's inputValidator (server-side, the actual guard — the client
// check alone can't be trusted). address/city are only required for
// deliveries; pickup orders send them empty by design.
export function validateCheckoutCustomer(input: {
  customer_name: string;
  customer_phone: string;
  address?: string | null;
  city?: string | null;
  delivery_method?: string | null;
}): CustomerValidationError | null {
  const name = nameSchema.safeParse(input.customer_name);
  if (!name.success) return { field: "customer_name", message: name.error.issues[0].message };

  const phone = phoneSchema.safeParse(input.customer_phone);
  if (!phone.success) return { field: "customer_phone", message: phone.error.issues[0].message };

  if (input.delivery_method !== "pickup") {
    const address = addressSchema.safeParse(input.address ?? "");
    if (!address.success) return { field: "address", message: address.error.issues[0].message };

    const city = citySchema.safeParse(input.city ?? "");
    if (!city.success) return { field: "city", message: city.error.issues[0].message };
  }

  return null;
}
