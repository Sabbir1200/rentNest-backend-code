import prisma from "../../lib/prisma";
import { catchAsync } from "../../utils/catch-async";
import type {Request,Response} from "express"
import { sendResponse } from "../../utils/send-response";

const allCategories = catchAsync(async(req:Request, res:Response)=>{


    const categories = await prisma.category.findMany({

    })
    sendResponse(res, {message: "Category retrieved successfully", data:categories})
})

export default allCategories