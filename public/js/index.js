// SOCKET.IO CONFIG desde el cliente
//Todo esto esta en la docu de socket.io
// Creamos un socket

// console.log('directorio actual:', process.cwd());

// import axios from 'axios';

const socket = io();

//FORMULARIO PARA AGREGAR PRODUCTOS
const addForm = document.getElementById('addForm');

if (addForm) {
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let code = document.getElementById('code').value;
    let price = document.getElementById('price').value;
    let available = document.getElementById('available').value;
    let stock = document.getElementById('stock').value;
    let category = document.getElementById('category').value;

    const product = {
      title,
      description,
      code,
      price,
      available,
      stock,
      category,
    };

    socket.emit('addProduct', product);

    // limpiar
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('available').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
  });
}

// FORMULARIO PARA BORRAR PRODUCTOS

const deleteForm = document.getElementById('deleteForm');

if (deleteForm) {
  deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let value = document.getElementById('pid').value;

    socket.emit('deleteValue', value);
    //limpiar
    document.getElementById('pid').value = '';
  });
}

//Funcion para generar el html
let htmlGenerator = (data) => {
  if (data) {
    const productList = document.getElementById('productList');

    productList.innerHTML = data
      .map((product) => {
        let productHtml = '';
        for (let key in product) {
          productHtml += `<li><span class="key"> ${key}:</span> <span class='value'>${product[key]}</span></li>`;
        }
        productHtml += '<br>';
        return productHtml;
      })
      .join('');
  } else {
    console.error('No se recibieron datos del servidor');
  }
};
///////////////////
//Imprimir lista de productos actualizadas despues de agregar producto
// socket.on('productAdded', (data) => htmlGenerator(data));
// /////////////////////////////////////////////

// //Imprimir lista de productos actualizadas despues de eliminar producto
// socket.on('deletedProduct', (data) => htmlGenerator(data));
/////////////////////
socket.on('updatedProducts', (data) => {
  htmlGenerator(data);
});
