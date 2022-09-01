import jwt_encode from "jwt-simple";

import Category from "../../src/models/Category";
import Product from "../../src/models/Product";
import Review from "../../src/models/Review";
import Upload from "../../src/models/Upload";
import Cart from "../../src/models/Cart";
import authService from "../../src/services/authService";
import connect from "../db-helper";
import { MongodHelper } from "../db-helper";
import category from "../fixtures/category";
import review from "../fixtures/reviews";
import product from "../fixtures/products";
import file from "../fixtures/files";
import cart from "../fixtures/cart";
import { user1, user2 } from "../fixtures/users";
import { authUser1, authUser2 } from "../fixtures/auth";
import User from "../../src/models/User";

let mongoHelper: MongodHelper

beforeAll(async () => {
    mongoHelper = await connect()
})

beforeEach(async () => {
    await Upload.insertMany([file.image1, file.image2, file.image3,file.image4])
    await Category.insertMany([category.category1, category.category2, category.category3,category.category4])
    await Product.insertMany([product.product1, product.product2, product.product3, product.product4])
    await Review.insertMany([review.productReviews1, review.productReviews2])
    await Cart.insertMany([cart.cart1, cart.cart2, cart.cart3, cart.cart4])
    await User.insertMany([user1, user2])
})

afterEach(async () => {
    await mongoHelper.clearDatabase()
})

afterAll(async () => {
    await mongoHelper.closeDatabase()
})

describe("test auth service", () => {
    test("test Login with user name and password", async () => {
        let jwt_password = jwt_encode.encode(authUser1.password, 'secret');
        const auth = await authService.userLogin(authUser1.email, jwt_password)
        expect(auth).toBeDefined()
    })
    test("test get profile with token", async () => {
        let jwt_password = jwt_encode.encode(authUser1.password, 'secret');
        const auth = await authService.userLogin(authUser1.email, jwt_password)
        if(auth){
            const user = await authService.getAuthByUserToken(auth) 
            const data = JSON.parse(JSON.stringify(user?.userId))
            expect(data?.email).toEqual(authUser1.email)
        }
    })
})
