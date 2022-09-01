import Product, {ProductDocument} from "../../src/models/Product";
import category from "./category";
import file from "./files";
import { user1 } from "./users";

const product1 = new Product({
    title: "product 1",
    description: "product 1 description",
    discount: 0,
    price: 100,
    quantity: 200,
    categoryId: [category.category3._id],
    imagesId: [file.image1._id,file.image2._id],
})

const product2 = new Product({
    title: "product 1",
    description: "product 1 description",
    discount: 0,
    price: 100,
    quantity: 200,
    categoryId: [category.category4._id],
    imagesId: [file.image2._id,file.image3._id, file.image4._id],
})

const product3 = new Product({
    title: "product 1",
    description: "product 1 description",
    discount: 0,
    price: 100,
    quantity: 200,
    categoryId: [ category.category1._id, category.category2._id],
    imagesId: [file.image2._id,file.image3._id],
})

const product4 = new Product({
    title: "product 1",
    description: "product 1 description",
    discount: 0,
    price: 100,
    quantity: 200,
    categoryId: [category.category3._id],
    imagesId: [file.image3._id,file.image4._id],
})

const updateObject : Partial<ProductDocument> = {
    description: "product 1 description update test",
    discount: 50,
    price: 100,
    quantity: 10,
    categoryId: [category.category3._id],
    imagesId: [file.image3._id,file.image4._id],
}

export default {
    product1,
    product2,
    product3,
    product4,
    updateObject,
}