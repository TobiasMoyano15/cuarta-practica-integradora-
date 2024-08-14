import { faker } from '@faker-js/faker';


const generateProductsMock = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric({ length: 5, casing: 'upper' }),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ max: 200 }),
        category: faker.commerce.department(),
        thumbnails: faker.image.urlLoremFlickr({
            category: 'coffee',
            width: 320,
            height: 240,
        })
    };
};

export default generateProductsMock;