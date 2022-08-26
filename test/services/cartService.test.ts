import Category from "../../src/models/Category";
import Product from "../../src/models/Product";
import Review from "../../src/models/Review";
import Upload from "../../src/models/Upload";
import Cart from "../../src/models/Cart";
import CartService from "../../src/services/cartService";
import connect from "../db-helper";
import { MongodHelper } from "../db-helper";
import category from "../fixtures/category";
import review from "../fixtures/reviews";
import product from "../fixtures/products";
import file from "../fixtures/files";
import cart from "../fixtures/cart";
import { user1 } from "../fixtures/users";


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
})

afterEach(async () => {
    await mongoHelper.clearDatabase()
})

afterAll(async () => {
    await mongoHelper.closeDatabase()
})

describe("test cart service", () => {
    test("test get all Cart carts", async () => {
        const carts = await CartService.getAllCarts()
        expect(carts.length).toBe(4)
    })
    test("test get Cart By User Id and Status", async () => {
        const carts = await CartService.getCartByUserId(user1._id, "Paid")
        expect(carts.length).toBe(1)
    })
    
})
