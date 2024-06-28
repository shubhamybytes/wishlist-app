import { json } from "@remix-run/node";

import db from '../db.server'
import { cors } from "remix-utils/cors";


export async function loader({request})  {
    const url = new URL(request.url);
    

    const customerId = url.searchParams.get('customerId');
    const productId = url.searchParams.get('productId');
    const shop = url.searchParams.get('shop');
    
    
    
    const data = await db.wishlist.findMany({
        where: {
            customerId: `${customerId}`,
            productId : `${productId}`,
            shop: shop
        }
    });
    return json({
        status: 'ok',
        message: "Hello from API",
        wishlistData :data, 
    })
}

    

export async function action({request}){
    const method = request.method;
    let data = await request.formData()
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const action = data.action;
    const id = Number(data.id);

    console.log('action', action);

    if(!customerId || !productId || !shop){
        return json({
            message: "Missing Required data. Required data: Customer ID, Product ID, Shop",
            method: method
        })
    }

    switch(method){
        
        case 'POST':
            switch(action){
                case '_add':
                    const wishlist = await db.wishlist.create({
                        data: {
                            customerId,
                            productId,
                            shop
                        }
                    });
                    const response = json({message: "Product added to wishlist", method: "POST", wishlist: wishlist, action: action });
                    return cors(request, response);
                    

                case '_delete':
                    const deletedItem = await db.wishlist.deleteMany({
                        where: {
                            
                            customerId,
                            productId,
                            shop
                        }
                    })
                    const deletedResponse = json({message: "Product Removed from wishlist", method: "Post", wishlist: deletedItem, action: action});
                    return cors(request, deletedResponse);

            }
            

        case 'PATCH':
            return json({message: "Success" , method: "PATCH"});
    }
}