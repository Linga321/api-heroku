import Category from "../../src/models/Category";
import file from "./files";
const category1 = new Category({
    name: "shoes",
    image: file.image1.filelocation,
})

const category2 = new Category({
    name: "shoes",
    image: file.image2.filelocation,
})

const category3 = new Category({
    name: "shoes",
    image: file.image3.filelocation,
})

const category4 = new Category({
    name: "shoes",
    image: file.image4.filelocation,
})

export default {
    category1,
    category2,
    category3,
    category4,
}