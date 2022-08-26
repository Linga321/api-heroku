
import category from "./category";
import file from "./files";
import { user1, user2 } from "./users";
import ProductDt from "./products";
import Cart from "../../src/models/Cart";

const cart1 = new Cart({
    userId: user1,
    products:[{
        productId: ProductDt.product4,
        itemQuantity: 10
    },
    {
        productId: ProductDt.product2,
        itemQuantity: 5
    },
    {
        productId: ProductDt.product3,
        itemQuantity: 6
    }],
    status: 'Paid' 
})
const cart2 = new Cart({
    userId: user2,
    products:[{
        productId: ProductDt.product1,
        itemQuantity: 11
    },
    {
        productId: ProductDt.product2,
        itemQuantity: 2
    },
    {
        productId: ProductDt.product3,
        itemQuantity: 3
    }],
    status: 'Paid' 
})

const cart3 = new Cart({
    userId: user1,
    products:[{
        productId: ProductDt.product1,
        itemQuantity: 10
    },
    {
        productId: ProductDt.product4,
        itemQuantity: 5
    }],
    status: 'Pending' 
})

const cart4 = new Cart({
    userId: user2,
    products:[{
        productId: ProductDt.product1,
        itemQuantity: 10
    },
    {
        productId: ProductDt.product2,
        itemQuantity: 5
    },
    {
        productId: ProductDt.product3,
        itemQuantity: 6
    }],
    status: 'Suspend' 
})

export default {
    cart1,
    cart2,
    cart3,
    cart4,
}