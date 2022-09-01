import Review from "../../src/models/Review";
import  product from "./products";
import { user1, user2 } from "./users";

const productReviews1 = new Review({
    userId: user1._id,
    productId: product.product1._id,
    rate: 5,
    comment: "Test comment",
    reviewState: "approved" ,
})

const productReviews2 = new Review({
    userId: user1._id,
    productId: product.product1._id,
    rate: 5,
    comment: "Test comment",
    reviewState: "approved" ,
})

export default {
    productReviews1,
    productReviews2,
}