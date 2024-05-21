// Define a function that takes product as a parameter and returns the email HTML
export const getDeleteProductEmail = (product) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; background-color: #2c2c2c; color: #f0f0f0; padding: 20px;">
    <p style="padding: 10px; color: #f0f0f0; font-size: 16px;">
      El siguiente producto le ha sido eliminado:
    </p>
    <p style="padding: 10px; color: #d3d3d3; font-size: 14px;">
      Id: ${product._id}
    </p>
    <hr style="border: 0; height: 1px; background: #555;">
    <p style="padding: 10px; color: #d3d3d3; font-size: 14px;">
      Producto: ${product.title}
    </p>
    <hr style="border: 0; height: 1px; background: #555;">
    <p style="padding: 10px; color: #d3d3d3; font-size: 14px;">
      Code: ${product.code}
    </p>
  </div>
`;
