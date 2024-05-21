export const swaggerConfiguration = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación API de E-commerce',
      description: 'Es una API de para la compra y venta de productos',
    },
  },
  apis: ['src/docs/**/*.yaml'],
};
