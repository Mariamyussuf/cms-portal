/**
 * Payment provider abstraction.
 *
 * The college site uses Bachs.io as its primary gateway, but Bachs is a
 * young platform built primarily for SaaS/subscription billing, not
 * one-time institutional fee collection. Every provider-specific call in
 * this app goes through this interface so that swapping in Paystack or
 * Flutterwave later — or running them side by side — never touches
 * anything outside `src/lib/payments/`.
 *
 * Do not import a concrete provider (e.g. `bachs.ts`) anywhere outside
 * this folder and `src/lib/payments/index.ts`. Always import from
 * `src/lib/payments` (the resolved `paymentProvider` export).
 */

export interface CreateCheckoutInput {
  /** Our own unique reference for this payment attempt (Payment.reference). */
  reference: string;
  amountKobo: number;
  currency: string;
  studentEmail: string;
  studentName: string;
  /** Short description shown on the provider's checkout page. */
  description: string;
  /** Where the provider should redirect the browser after checkout. */
  redirectUrl: string;
}

export interface CreateCheckoutResult {
  checkoutUrl: string;
  /** The provider's own identifier for this session/transaction, if any. */
  providerReference: string | null;
}

export type VerifiedPaymentStatus = "successful" | "failed" | "pending";

export interface VerifyPaymentResult {
  status: VerifiedPaymentStatus;
  amountKobo: number;
  currency: string;
  providerReference: string;
  /** Raw payload from the provider, stored for audit/debugging. */
  raw: unknown;
}

export interface WebhookVerificationInput {
  /** Raw request body, exactly as received (needed for signature checks). */
  rawBody: string;
  /** Relevant headers, e.g. the signature header the provider sends. */
  headers: Record<string, string | undefined>;
}

export interface WebhookEvent {
  type: "payment.successful" | "payment.failed" | "payment.pending" | "unknown";
  reference: string | null;
  providerReference: string | null;
  amountKobo: number | null;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: "BACHS" | "PAYSTACK" | "FLUTTERWAVE";

  /** Start a hosted checkout session and return the URL to redirect the payer to. */
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;

  /** Re-query the provider directly for a transaction's true status (source of truth). */
  verifyPayment(providerReference: string): Promise<VerifyPaymentResult>;

  /** Validate an inbound webhook's signature and normalize its payload. */
  parseWebhookEvent(input: WebhookVerificationInput): WebhookEvent | null;
}
