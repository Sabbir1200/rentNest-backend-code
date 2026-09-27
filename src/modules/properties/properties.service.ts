import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export async function getPropertyById (id:string){

    const property = await prisma.property.findUnique({
        where:{
            id
        }
    })
    if(!property){
        throw new AppError (404,"The Property model does not exist in the database.")
    }
    return property
}