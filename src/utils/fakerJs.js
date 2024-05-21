import { Faker, es, en } from '@faker-js/faker';

const faker = new Faker({
  locale: [es, en], //!Idioma
});

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: faker.commerce.price(),
    code: faker.string.alphanumeric({ length: 10 }).toLocaleUpperCase(),
    stock: faker.number.int({ min: 100, max: 300 }),
    status: faker.datatype.boolean(),
    available: faker.datatype.boolean(),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  };
};
