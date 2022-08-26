import Upload from "../../src/models/Upload";
import fileNameGenerator from "../../src/util/randomString";

const image1 = new Upload({
    filename: '1.png',
    filelocation: 'upload/1.png',
})

const image2 = new Upload({
    filename: '2.png',
    filelocation: 'upload/2.png',
})

const image3 = new Upload({
    filename: '3.png',
    filelocation: 'upload/3.png',
})

const image4 = new Upload({
    filename: '4.png',
    filelocation: 'upload/4.png',
})

export default {
    image1,
    image2,
    image3,
    image4,
}
