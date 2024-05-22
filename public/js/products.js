//traemos el boton de add to cart
const btns_addToCart = document.getElementsByClassName('btn_addToCart');
const btns_dltProduct = document.getElementsByClassName('btn_dltProduct');

//traemos el boton de logout
const logoutBtn = document.getElementById('logoutBtn');

//de aca sacamos el id del carrito del usuario en particular
// const productosContainer = document.getElementById('productosContainer');
// const cartId = productosContainer.dataset.cartId;

const userWelcome = document.querySelector('.user_bienvenida');
const cartId = userWelcome.getAttribute('data-cart-id');

//LOGICA PARA EL BOTON ADD PRODUCT TO CART

const addProductToCart = async (pId, cartId) => {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${pId}`, {
      // body: null, //si se manda body hacerle un JSON.strigify
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 403) {
      alert('User premium no puede agregar sus propios productos al cart');
    } else if (response.status === 200) {
      alert('Producto agregado correctamente');
    } else {
      alert('No se pudo agregar el producto');
    }
  } catch (error) {
    alert('No se pudo agregar');
  }
};

for (let button of btns_addToCart) {
  button.addEventListener('click', (event) => {
    addProductToCart(button.id, cartId);
  });
}

//!LOGICA PARA EL BOTON DLT PRODUCT (ELIMINAR PRODCUTO)

const deleteProduct = async (pId) => {
  try {
    const response = await fetch(`/api/products/${pId}`, {
      // body: null, //si se manda body hacerle un JSON.strigify
      method: 'DELETE',
    });

    if (response.status === 400) {
      console.log(response);
      alert('No puede eliminar el producto status 400');
    } else if (response.status === 200) {
      alert('Producto eliminado correctamente');
      window.location.reload();
    } else if (response.status === 401) {
      alert('No tiene permisos para eliminar este producto');
    } else {
      alert('No se pudo eliminar el producto');
    }
  } catch (error) {
    alert(error);
  }
};

for (let button of btns_dltProduct) {
  button.addEventListener('click', (event) => {
    if (confirm(`¿Está seguro que desea eliminar el producto: ${button.id}?`)) {
      deleteProduct(button.id, cartId);
    }
  });
}

//!LOGICA PARA EL BOTON LOGOUT

logoutBtn.addEventListener('click', async (event) => {
  const result = await fetch('/api/sessions/logout', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });

  const { redirect } = await result.json();
  window.location.href = redirect; //averiguar por esto
});
