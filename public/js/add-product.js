document
  .getElementById('productForm')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío predeterminado del formulario

    fetch('/api/products', {
      method: 'POST',
      body: new FormData(event.target),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message); // Mostrar mensaje de éxito
        if (data.redirectTo) {
          window.location.href = data.redirectTo; // Redirigir a la ruta especificada
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
