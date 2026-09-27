import type {Request,Response } from "express"
import  { catchAsync } from "../../utils/catch-async"
import prisma from "../../lib/prisma"
import { sendResponse } from "../../utils/send-response"
import z from "zod"
import { getPropertyById } from "./properties.service"

const getProperties = catchAsync(async(req:Request, res:Response)=>{
   const properties = await prisma.property.findMany({

   })
    sendResponse(res, {message : "Properties retrieved successfully",data:{properties}} )
})

const propertyIdParamsSchema = z.object({
    id: z.uuid()
})

const getProperty =catchAsync(async(req:Request, res:Response) =>{
  const {id}= propertyIdParamsSchema.parse(req.params);
  const property = await getPropertyById(id)
   sendResponse(res, {message: "Single Property retrieved successfully", data:{property}})
})

export const propertiesController = {
    getProperties,
    getProperty
}