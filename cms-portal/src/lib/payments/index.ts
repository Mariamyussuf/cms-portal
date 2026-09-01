import { paystackProvider } from "./paystack";
import type { PaymentProvider } from "./provider";

/**
 * The rest of the app should only ever import `paymentProvider` from here —
 * never a concrete provider file directly. Swapping Paystack for Flutterwave or
 * running both is a one-line change in this file, not a rewrite of every
 * place that touches payments.
 */
export const paymentProvider: PaymentProvider = paystackProvider;

export * from "./provider";
