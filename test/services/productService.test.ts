import Category from "../../src/models/Category";
import Product from "../../src/models/Product";
import Review from "../../src/models/Review";
import Upload from "../../src/models/Upload";
import ProductService from "../../src/services/productService";
import connect from "../db-helper";
import { MongodHelper } from "../db-helper";
import category from "../fixtures/category";
import review from "../fixtures/reviews";
import product from "../fixtures/products";
import file from "../fixtures/files";

let mongoHelper: MongodHelper

beforeAll(async () => {
    mongoHelper = await connect()
})

beforeEach(async () => {
    await Upload.insertMany([file.image1, file.image2, file.image3,file.image4])
    await Category.insertMany([category.category1, category.category2, category.category3,category.category4])
    await Product.insertMany([product.product1, product.product2, product.product3, product.product4])
    await Review.insertMany([review.productReviews1, review.productReviews2])
})

afterEach(async () => {
    await mongoHelper.clearDatabase()
})

afterAll(async () => {
    await mongoHelper.closeDatabase()
})

describe("test product service", () => {
    test("test join collection with categories and images", async () => {
        const productfound = await ProductService.getSingleProduct(product.product1._id)
        expect(productfound?.title).toEqual(product.product1.title)
    })
    test("find all product by category Id ", async () => {
        const productfound = await ProductService.getProductByCategoryId(category.category1._id)
        expect(productfound.length).toBe(1)
    })
    test("find update product product", async () => {
        const productfound = await ProductService.updateProduct(product.product1._id, product.updateObject)
        expect(productfound?.description).toEqual(product.updateObject.description)
    })
    test("find all product", async () => {
        const productfound = await ProductService.getAllProduct()
        expect(productfound.length).toBe(4)
    })
})


