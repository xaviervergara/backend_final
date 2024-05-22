//!LOGICA PARA ELIMINAR PRODUCTO DEL CARRITO
const dlt_product = document.getElementsByClassName('dlt_prod');
const cart_data = document.querySelector('.main-container');
const cart_id = cart_data.getAttribute('data-cart-id');

for (let button of dlt_product) {
  button.addEventListener('click', async (event) => {
    if (confirm(`Está seguro que desea eliminar el producto: ${button.id}`)) {
      const response = await fetch(
        `/api/carts/${cart_id}/product/${button.id}`,
        {
          method: 'DELETE',
        }
      );
      alert(`Se elimino producto ${button.id}`);
      location.reload();
    }
  });
}

//!LOGICA PARA VACIAR CARRITO
const empty_cart = document.getElementById('empty_cart');

empty_cart.addEventListener('click', async (event) => {
  if (confirm(`Está seguro que desea vaciar el carrito?`)) {
    const response = await fetch(`/api/carts/${cart_id}`, {
      method: 'DELETE',
    });
    if (response.status === 204) {
      alert(`Cart's already empty`);
    } else if (response.status === 200) {
      alert(`Carrito eliminado`);
      location.reload();
    }
  }
});

//!LOGICA PARA HACER LA COMPRA

const purchase_btn = document.getElementById('purchase_btn');

purchase_btn.addEventListener('click', async (event) => {
  const response = await fetch(`api/carts/${cart_id}/purchase`, {
    method: 'GET',
  });
  if (response.status === 204) {
    alert(`Empty cart`);
  }

  const { ticket, redirect } = await response.json();
  window.location.href = redirect;
});
