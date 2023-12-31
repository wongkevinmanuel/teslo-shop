import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces";
import { db } from ".";
import { Order } from "../models";

export const getOrderById = async (id: string): Promise< IOrder | null> => {
    if(!isValidObjectId(id)){
        return null;
    }
    await db.connect();
    const order = await Order.findById(id).lean();
    await db.disconnect();

    if(!order){
        return null;
    }

    //Informacion con serializacion
    return JSON.parse(JSON.stringify(order));
}

export const getOrderByUser = async(id: string): Promise< IOrder[] | null > => {
    if(!isValidObjectId(id)){
        return null;
    }
    
    await db.connect();
    const orders = await Order.find({user: id}).lean();
    await db.disconnect();
    
    return orders;
}