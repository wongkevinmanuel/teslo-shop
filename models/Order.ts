import mongoose, { Schema, model, Model} from 'mongoose';
import {IOrder} from '../interfaces'

const orderSchema = new Schema( {
    //Id de mongoo
    user: { type: Schema.Types.ObjectId,
            ref: 'User',
            required: true},
    //toda la orden se guarda y se muestra como 
    //fue grabada en el momento de la compra 
    //  LA ORDEN NUNCA SE MODIFICA
    // _id hace referencia al producto de la BD
    // slug para mostrar rapidamente la imagen (URL)
    // price como se realizo la orden (nunca cambia porque la orden se realiza con ese precio)
    orderItems: [{
        _id     : { type:Schema.Types.ObjectId, ref: 'Product', required: true },
        title   : { type:String, required: true },
        size    : { type:String, required: true },
        quantity: { type:Number, required: true },
        slug    : { type:String, required: true },
        image   : { type:String, required: true },
        price   : { type:Number, required: true },
    }],
    shippingAddress: {
        firstName   : { type: String, required: true},
        lastName    : { type: String, required: true},
        address     : { type: String, required: true},
        address2    : { type: String },
        zip         : { type: String, required: true},
        city        : { type: String, required: true},
        country     : { type: String, required: true},
        phone       : { type: String, required: true},
    },

    numberOfItems   : {type: Number, required: true },
    subTotal        : {type: Number, required: true },
    tax             : {type: Number, required: true },
    total           : {type: Number, required: true },
    
    isPaid          : {type: Boolean, required: true, default: false },
    paidAt          : {type: String },

    //Relacion de orden con gestor de pago
    transactionId   : { type:String } 
},{
    timestamps: true
})

const Order: Model<IOrder> = mongoose.models.Order || model('Order', orderSchema);

export default Order;