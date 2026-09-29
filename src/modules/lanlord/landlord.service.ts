import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { RequestStatus } from "../../../prisma/generated/prisma/enums";

// Create property
export const createProperty = async (
  landlordId: string,
  input: {
    categoryId: string;
    title: string;
    description: string;
    address: string;
    city: string;
    rentAmount: number;
  }
) => {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });

  if (!category) {
    throw new AppError(404, "Property category not found");
  }

  return prisma.property.create({
    data: {
      ...input,
      landlordId,
    },
  });
};

// Update property
export const updateProperty = async (
  landlordId: string,
  propertyId: string,
  input: {
    categoryId?: string;
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    rentAmount?: number;
    isAvailable?: boolean;
  }
) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw new AppError(404, "Property category not found");
    }
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: input,
  });
};

// Delete property
export const deleteProperty = async (
  landlordId: string,
  propertyId: string
) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  return prisma.property.delete({
    where: { id: propertyId },
  });
};

// Get rental requests for landlord's properties
export const getLandlordRequests = async (
  landlordId: string
) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: true,
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Approve or reject rental request
export const updateRentalRequestStatus = async (
  landlordId: string,
  requestId: string,
  status: RequestStatus
) => {
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new AppError(
      400,
      "Status must be APPROVED or REJECTED"
    );
  }

  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      id: requestId,
      property: {
        landlordId,
      },
    },
  });

  if (!rentalRequest) {
    throw new AppError(404, "Rental request not found");
  }

  if (rentalRequest.status !== "PENDING") {
    throw new AppError(
      400,
      "Only pending rental requests can be updated"
    );
  }

  return prisma.rentalRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status,
    },
  });
};