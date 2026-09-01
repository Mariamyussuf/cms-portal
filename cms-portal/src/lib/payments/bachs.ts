import crypto from "node:crypto";
import type {
  PaymentProvider,
  CreateCheckoutInput,
  CreateCheckoutResult,
  VerifyPaymentResult,
  WebhookVerificationInput,
  WebhookEvent,
} from "./provider";

/**
 * Bachs.io implementation.
 *
 * CONFIRMED from public docs (docs.bachs.io, as of building this):
 *  - Base URLs: https://sandbox-api.bachs.io/v1 and https://api.bachs.io/v1
 *  - Auth: `Authorization: Bearer sk_sandbox_...` / `sk_live_...`
 *  - Money is a DECIMAL STRING at currency precision (e.g. "29.00"), never minor units.
 *  - Checkout sessions are created against a pre-existing `product_id` —
 *    Bachs is catalog/subscription-first, there is no confirmed ad-hoc
 *    "charge this arbitrary amount" endpoint in what's publicly documented.
 *  - Minimum transaction size observed: ₦1,000 NGN.
 *  - Webhooks are the source of truth for fulfilment (never trust redirects).
 *  - Webhook requests are signed and expect your server clock within ~300s.
 *  - Supported store currencies today: USD and NGN only.
 *
 * NOT CONFIRMED — do not treat these as verified:
 *  - The exact webhook event type names beyond `collection.succeeded`
 *    (mentioned once in Bachs's own agent-instructions snippet). The
 *    "four events" a real integration guide references are not enumerated
 *    anywhere I could read.
 *  - The exact webhook signature header name and HMAC algorithm/format.
 *  - The exact shape of a checkout-session response body (I've seen the
 *    request shape, not a full response example).
 *  - Whether there's a supported way to create a checkout for a *dynamic*
 *    amount rather than a pre-created product/price — this matters a lot
 *    for a fee portal where amounts are per-student.
 *
 * ACTION REQUIRED before this touches real money:
 *  1. Read the full API reference at https://docs.bachs.io/api-reference
 *     (behind signup) and Bachs's own webhook guide at
 *     https://docs.bachs.io/developer-portal/webhooks once you have a
 *     dashboard account — confirm event names and signature scheme there,
 *     not from this file.
 *  2. Decide how to handle dynamic per-student amounts: either (a) create
 *     a Bachs product on the fly per payment via their Products API before
 *     each checkout, if that's supported, or (b) pre-create one product
 *     per FeeStructure/AssociationDues row and keep `bachsProductId` on
 *     those models, updating it whenever the amount changes.
 *  3. Test the ₦1,000 minimum against your smallest real fee/dues amount —
 *     if anything charges less, either raise it or route that item to a
 *     different provider.
 *  4. Replace the placeholder signature check below with the real scheme
 *     from Bachs's webhook docs before deploying anywhere near production.
 */

const BASE_URL = process.env.BACHS_API_BASE_URL ?? "https://sandbox-api.bachs.io/v1";
const API_KEY = process.env.BACHS_API_KEY;

function assertConfigured() {
  if (!API_KEY) {
    throw new Error(
      "BACHS_API_KEY is not set. Add it to your environment before creating checkouts."
    );
  }
}

function koboToDecimalString(amountKobo: number): string {
  return (amountKobo / 100).toFixed(2);
}

export const bachsProvider: PaymentProvider = {
  name: "BACHS",

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    assertConfigured();

    // IMPORTANT: this assumes a `bachsProductId` has already been resolved
    // for whatever the student is paying for (a FeeStructure row or an
    // AssociationDues row) and passed in via `description`/metadata by the
    // caller — see the action-required note above. Wiring that resolution
    // step up is a prerequisite, not something this function can infer.
    throw new Error(
      "bachsProvider.createCheckout is a scaffold, not a verified implementation. " +
        "Confirm the checkout-session request/response shape and dynamic-amount " +
        "strategy against your Bachs dashboard docs, then implement the fetch() " +
        "call here. See the comment block at the top of this file."
    );

    // Sketch of what the call will likely look like, once confirmed:
    //
    // const res = await fetch(`${BASE_URL}/checkout-sessions`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     product_cart: [{ product_id: /* resolved product id */, quantity: 1 }],
    //     customer: { email: input.studentEmail, name: input.studentName },
    //     return_url: input.redirectUrl,
    //     cancel_url: input.redirectUrl,
    //     reference: input.reference, // if Bachs supports a client reference field — unconfirmed
    //   }),
    // });
    // if (!res.ok) throw new Error(`Bachs checkout creation failed: ${res.status}`);
    // const data = await res.json();
    // return { checkoutUrl: data.checkout_url, providerReference: data.id ?? null };
  },

  async verifyPayment(providerReference: string): Promise<VerifyPaymentResult> {
    assertConfigured();
    throw new Error(
      `bachsProvider.verifyPayment is a scaffold. Confirm GET /checkout-sessions/${providerReference} ` +
        "(or the equivalent retrieve-transaction endpoint) against the real API reference before implementing."
    );
  },

  parseWebhookEvent(input: WebhookVerificationInput): WebhookEvent | null {
    const webhookSecret = process.env.BACHS_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("BACHS_WEBHOOK_SECRET is not set.");
    }

    // PLACEHOLDER signature scheme (HMAC-SHA256 of the raw body, hex-encoded,
    // compared to a header). This is the common pattern across providers but
    // is NOT confirmed for Bachs specifically — the header name below
    // ("x-bachs-signature") is a guess and must be verified against Bachs's
    // real webhook documentation before this is trusted with real payments.
    const signatureHeader = input.headers["x-bachs-signature"];
    if (!signatureHeader) {
      return null;
    }

    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(input.rawBody, "utf8")
      .digest("hex");

    const providedBuf = Buffer.from(signatureHeader);
    const expectedBuf = Buffer.from(expected);
    const isValid =
      providedBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(providedBuf, expectedBuf);

    if (!isValid) {
      return null;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(input.rawBody);
    } catch {
      return null;
    }

    // Shape below is inferred from the one confirmed event name
    // (`collection.succeeded`) plus conventional payload structure. Replace
    // this with the real event parsing once you've seen actual webhook
    // deliveries in the Bachs sandbox.
    const event = payload as {
      type?: string;
      data?: {
        reference?: string;
        id?: string;
        amount?: string; // decimal string per Bachs convention
      };
    };

    const amountKobo = event.data?.amount
      ? Math.round(parseFloat(event.data.amount) * 100)
      : null;

    switch (event.type) {
      case "collection.succeeded":
        return {
          type: "payment.successful",
          reference: event.data?.reference ?? null,
          providerReference: event.data?.id ?? null,
          amountKobo,
          raw: payload,
        };
      case "collection.failed":
        return {
          type: "payment.failed",
          reference: event.data?.reference ?? null,
          providerReference: event.data?.id ?? null,
          amountKobo,
          raw: payload,
        };
      default:
        return {
          type: "unknown",
          reference: event.data?.reference ?? null,
          providerReference: event.data?.id ?? null,
          amountKobo,
          raw: payload,
        };
    }
  },
};

export { koboToDecimalString };
