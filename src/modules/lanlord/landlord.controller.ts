import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { AppError } from "../../utils/app-error";
import { sendResponse } from "../../utils/send-response";

import {
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordRequests,
  updateRentalRequestStatus,
} from "./landlord.service";

// POST /api/landlord/properties
const postProperty = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const property = await createProperty(
      req.user.id,
      req.body
    );

    sendResponse(res, {
      message: "Property created successfully",
      data: property,
    }, 201);
  }
);

// PUT /api/landlord/properties/:id
const putProperty = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError(400, "Invalid property ID");
    }

    const property = await updateProperty(
      req.user.id,
      id,
      req.body
    );

    sendResponse(res, {
      message: "Property updated successfully",
      data: property,
    });
  }
);

// DELETE /api/landlord/properties/:id
const removeProperty = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError(400, "Invalid property ID");
    }

    await deleteProperty(req.user.id, id);

    sendResponse(res, {
      message: "Property deleted successfully",
      data: null,
    });
  }
);

// GET /api/landlord/requests
const getRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const requests = await getLandlordRequests(
      req.user.id
    );

    sendResponse(res, {
      message: "Rental requests retrieved successfully",
      data: requests,
    });
  }
);

// PATCH /api/landlord/requests/:id
const patchRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError(400, "Invalid rental request ID");
    }

    const { status } = req.body;

    if (typeof status !== "string") {
      throw new AppError(
        400,
        "Status is required"
      );
    }

    const rentalRequest = await updateRentalRequestStatus(
      req.user.id,
      id,
      status as "PENDING" | "APPROVED" | "REJECTED"
    );

    sendResponse(res, {
      message: "Rental request status updated successfully",
      data: rentalRequest,
    });
  }
);

const landlordController = {
  postProperty,
  putProperty,
  removeProperty,
  getRequests,
  patchRequestStatus,
};

export default landlordController;