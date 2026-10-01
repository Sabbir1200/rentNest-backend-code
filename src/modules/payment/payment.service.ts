import prisma from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { AppError } from "../../utils/app-error"

export const createCheckoutSession = async(tenantId: string, requestId:string)=>{

    const request = await prisma.rentalRequest.findUnique({
        where:{
            id:requestId
        },
        include:{
            property : true,
            payment : true
        }
    })

    if(!request){
        throw new AppError(404, "Booking not found")
    }
    if(request.payment?.status === "COMPLETED"){
        throw new AppError(400,"Booking already completed")
    }
    const session = await stripe.checkout.sessions.create({
  mode: "payment",

  metadata: {
    rentalRequestId: requestId,
  },

  success_url: "http://localhost:3000/payment/success",
  cancel_url: "http://localhost:3000/payment/cancel",

  line_items: [
    {
      quantity: 1,
      price_data: {
        currency: "USD",
        unit_amount: Math.round(Number(request.totalAmount) * 100),
        product_data: {
          name: request.property.title,
        },
      },
    },
  ],
});
    await prisma.payment.upsert({
  where: {
    rentalRequestId: requestId,
  },
  create: {
    rentalRequestId: requestId,
    tenantId: tenantId,
    amount: request.totalAmount,
    currency: "USD",
    provider: "STRIPE",
    status: "PENDING",
    transactionId: session.id,
  },
  update: {
    amount: request.totalAmount,
     transactionId: session.id,
    status: "PENDING",
  },
});
return {checkOut_url:session.url}
}

export const completedPayment = async (
    requestId: string,
    transactionId: string
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            rentalRequestId: requestId,
        },
    });

    if (!payment) {
        throw new AppError(404, "Payment not found");
    }

    if (payment.status === "COMPLETED") {
        throw new AppError(400, "Payment already completed");
    }

    const updatedPayment = await prisma.payment.update({
        where: {
            rentalRequestId: requestId,
        },
        data: {
            transactionId,
            status: "COMPLETED",
            paidAt: new Date(),
        },
    });

    return updatedPayment;
};