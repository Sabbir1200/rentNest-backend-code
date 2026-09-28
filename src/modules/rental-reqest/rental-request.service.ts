import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

type CreateRentalRequestInput = {
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  message?: string;
};

export const createRentalRequest = async (
  input: CreateRentalRequestInput
) => {
  const {
    tenantId,
    propertyId,
    startDate,
    endDate,
    message,
  } = input;

  // 1. Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new AppError(400, "Invalid rental dates");
  }

  if (end <= start) {
    throw new AppError(
      400,
      "End date must be after start date"
    );
  }

  // 2. Find property
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    select: {
      id: true,
      rentAmount: true,
      isAvailable: true,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  if (!property.isAvailable) {
    throw new AppError(400, "Property is not available");
  }

  // 3. Calculate total amount
  // Assumption: rent is monthly; each 30-day period
  // or partial period is charged as one month.
  const durationInDays = Math.ceil(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const months = Math.ceil(durationInDays / 30);

  const totalAmount = property.rentAmount.mul(months);

  // 4. Create rental request
  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      startDate: start,
      endDate: end,
      totalAmount,
     message: message ?? null,
    },
  });

  return rentalRequest;
};


export const getRentalRequests = async (tenantId: string) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;
};

export const getRentalRequestById = async (
  rentalId: string,
  tenantId: string
) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalId,
      tenantId,
    },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new AppError(404, "Rental request not found");
  }

  return rentalRequest;
};