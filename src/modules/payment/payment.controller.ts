import type Stripe from "stripe";
import { AppError } from "../../utils/app-error";
import { catchAsync } from "../../utils/catch-async";
import type {Request,Response} from "express"
import { stripe } from "../../lib/stripe";
import config from "../../config";
import z from "zod";
import { createCheckoutSession } from "./payment.service";
import { sendResponse } from "../../utils/send-response";
import prisma from "../../lib/prisma";


export const webhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
        throw new AppError(400, "Missing stripe-signature header");
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        throw new AppError(400, "Invalid webhook signature");
    }

    if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.expired" ||
        event.type === "checkout.session.async_payment_failed"
    ) {
        const session = event.data.object as Stripe.Checkout.Session;

        const rentalRequestId = session.metadata?.rentalRequestId;

        if (!rentalRequestId) {
            throw new AppError(400, "Rental request ID missing from metadata");
        }

        if (event.type === "checkout.session.completed") {
            const transactionId = session.payment_intent;

            await prisma.payment.update({
                where: {
                    rentalRequestId,
                },
                data: {
                    status: "COMPLETED",
                    transactionId: transactionId as string,
                    paidAt: new Date(),
                },
            });
        }

        if (
            event.type === "checkout.session.expired" ||
            event.type === "checkout.session.async_payment_failed"
        ) {
            await prisma.payment.update({
                where: {
                    rentalRequestId,
                },
                data: {
                    status: "FAILED",
                },
            });
        }
    }

    res.status(200).json({
        received: true,
    });
});

const requestIdParamsSchema = z.object({
    id : z.uuid()
})

export const checkout = catchAsync(async(req:Request, res:Response)=>{
    const {id} = requestIdParamsSchema.parse(req.params);

    const result = await createCheckoutSession(req.user!.id, id)

    sendResponse(res, {message: "CheckOut session completed", data: result})
})