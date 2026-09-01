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
 * Paystack payment provider implementation.
 *
 * Key integration details:
 *  - API base: https://api.paystack.co
 *  - Auth: `Authorization: Bearer sk_test_...` / `sk_live_...`
 *  - Amounts are in kobo (minor units) — matches our internal convention.
 *  - Initialize: POST /transaction/initialize → returns { authorization_url, access_code, reference }
 *  - Verify: GET /transaction/verify/:reference → returns full transaction data
 *  - Webhooks: HMAC-SHA512 of the raw body using secret key, compared to `x-paystack-signature` header
 *  - Events: `charge.success`, `charge.failed`
 */

const API_BASE = "https://api.paystack.co";
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

function assertConfigured() {
  if (!SECRET_KEY) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add it to your environment before creating checkouts.",
    );
  }
}

export const paystackProvider: PaymentProvider = {
  name: "PAYSTACK",

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    assertConfigured();

    const res = await fetch(`${API_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.studentEmail,
        amount: input.amountKobo, // Paystack expects kobo
        currency: input.currency || "NGN",
        reference: input.reference,
        callback_url: input.redirectUrl,
        metadata: {
          student_name: input.studentName,
          description: input.description,
          custom_fields: [
            {
              display_name: "Student Name",
              variable_name: "student_name",
              value: input.studentName,
            },
            {
              display_name: "Description",
              variable_name: "description",
              value: input.description,
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Paystack initialization failed (${res.status}): ${error}`);
    }

    const data = (await res.json()) as {
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    };

    if (!data.status) {
      throw new Error(`Paystack initialization failed: ${data.message}`);
    }

    return {
      checkoutUrl: data.data.authorization_url,
      providerReference: data.data.access_code,
    };
  },

  async verifyPayment(reference: string): Promise<VerifyPaymentResult> {
    assertConfigured();

    const res = await fetch(
      `${API_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Paystack verification failed (${res.status}): ${error}`);
    }

    const data = (await res.json()) as {
      status: boolean;
      data: {
        status: string;
        amount: number;
        currency: string;
        reference: string;
        id: number;
        [key: string]: unknown;
      };
    };

    const txStatus = data.data.status;
    let status: "successful" | "failed" | "pending";
    if (txStatus === "success") {
      status = "successful";
    } else if (txStatus === "failed" || txStatus === "abandoned" || txStatus === "reversed") {
      status = "failed";
    } else {
      status = "pending";
    }

    return {
      status,
      amountKobo: data.data.amount,
      currency: data.data.currency,
      providerReference: String(data.data.id),
      raw: data.data,
    };
  },

  parseWebhookEvent(input: WebhookVerificationInput): WebhookEvent | null {
    const webhookSecret = SECRET_KEY;
    if (!webhookSecret) {
      throw new Error("PAYSTACK_SECRET_KEY is not set.");
    }

    // Paystack signs webhooks with HMAC-SHA512 using the secret key
    const signatureHeader = input.headers["x-paystack-signature"];
    if (!signatureHeader) {
      return null;
    }

    const expected = crypto
      .createHmac("sha512", webhookSecret)
      .update(input.rawBody, "utf8")
      .digest("hex");

    if (signatureHeader !== expected) {
      return null;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(input.rawBody);
    } catch {
      return null;
    }

    const event = payload as {
      event?: string;
      data?: {
        reference?: string;
        id?: number;
        amount?: number;
        status?: string;
      };
    };

    switch (event.event) {
      case "charge.success":
        return {
          type: "payment.successful",
          reference: event.data?.reference ?? null,
          providerReference: event.data?.id ? String(event.data.id) : null,
          amountKobo: event.data?.amount ?? null,
          raw: payload,
        };
      case "charge.failed":
        return {
          type: "payment.failed",
          reference: event.data?.reference ?? null,
          providerReference: event.data?.id ? String(event.data.id) : null,
          amountKobo: event.data?.amount ?? null,
          raw: payload,
        };
      default:
        return {
          type: "unknown",
          reference: event.data?.reference ?? null,
          providerReference: event.data?.id ? String(event.data.id) : null,
          amountKobo: event.data?.amount ?? null,
          raw: payload,
        };
    }
  },
};
