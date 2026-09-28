import prisma from "../../lib/prisma";
import { catchAsync } from "../../utils/catch-async";
import type {Request, Response} from "express"
import { sendResponse } from "../../utils/send-response";
import { createRentalRequest, getRentalRequestById, getRentalRequests } from "./rental-request.service";
import { AppError } from "../../utils/app-error";

const postRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const tenantId = req.user.id;

    const {
      propertyId,
      startDate,
      endDate,
      message,
    } = req.body;

    const rentalRequest = await createRentalRequest({
      tenantId,
      propertyId,
      startDate,
      endDate,
      message,
    });

    sendResponse(
      res,
      {
        message: "Rental request created successfully",
        data: rentalRequest,
      },
      201
    );
  }
);

// GET /api/rentals
const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const tenantId = req.user.id;

    const rentalRequests = await getRentalRequests(tenantId);

    sendResponse(res, {
      message: "Rental requests retrieved successfully",
      data: rentalRequests,
    });
  }
);

// GET /api/rentals/:id
const getRentalRequestDetails = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const tenantId = req.user.id;
    const { id } = req.params;

      if (!id || Array.isArray(id)) {
      throw new AppError(400, "Invalid rental request ID");
    }

    const rentalRequest = await getRentalRequestById(
      id,
      tenantId
    );

    sendResponse(res, {
      message: "Rental request retrieved successfully",
      data: rentalRequest,
    });
  }
);

const rentalRequest = {
  postRentalRequest,
  getMyRentalRequests,
  getRentalRequestDetails,
};

export default rentalRequest;