import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { AppError } from "../../utils/app-error";
import { sendResponse } from "../../utils/send-response";

import {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
} from "./admin.service";
import type { UserStatus } from "../../../prisma/generated/prisma/enums";

// GET /api/admin/users
const getUsers = catchAsync(
  async (_req: Request, res: Response) => {
    const users = await getAllUsers();

    sendResponse(res, {
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

// PATCH /api/admin/users/:id
const patchUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError(400, "Invalid user ID");
    }

    const { status } = req.body;

    if (
      typeof status !== "string" ||
      !["ACTIVE", "BANNED"].includes(status)
    ) {
      throw new AppError(
        400,
        "Status must be ACTIVE or BANNED"
      );
    }

    const user = await updateUserStatus(
      id,
      status as UserStatus
    );

    sendResponse(res, {
      message:
        status === "BANNED"
          ? "User banned successfully"
          : "User unbanned successfully",
      data: user,
    });
  }
);
// GET /api/admin/properties
const getProperties = catchAsync(
  async (_req: Request, res: Response) => {
    const properties = await getAllProperties();

    sendResponse(res, {
      message: "Properties retrieved successfully",
      data: properties,
    });
  }
);

// GET /api/admin/rentals
const getRentals = catchAsync(
  async (_req: Request, res: Response) => {
    const rentals = await getAllRentals();

    sendResponse(res, {
      message: "Rental requests retrieved successfully",
      data: rentals,
    });
  }
);

const adminController = {
  getUsers,
  patchUserStatus,
  getProperties,
  getRentals,
};

export default adminController;