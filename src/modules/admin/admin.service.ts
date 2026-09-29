import type { UserStatus } from "../../../prisma/generated/prisma/enums";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

// GET /api/admin/users
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
    orderBy: {
      email: "asc",
    },
  });
};

// PATCH /api/admin/users/:id
export const updateUserStatus = async (
  userId: string,
  status: UserStatus
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

// GET /api/admin/properties
export const getAllProperties = async () => {
  return prisma.property.findMany({
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// GET /api/admin/rentals
export const getAllRentals = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          email: true,
        },
      },
      property: {
        include: {
          landlord: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};