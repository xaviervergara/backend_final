//*DELETE USER BUTTON

document.addEventListener('DOMContentLoaded', () => {
  //! Obtener todos los botones con la clase 'user-button'
  const deleteButtons = document.querySelectorAll('.user-button');

  //! Añadir event listener a cada botón de eliminación
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const userId = button.getAttribute('data-id');

      //! Confirmar antes de eliminar
      if (
        confirm(
          `¿Está seguro de que desea eliminar al usuario con ID: ${userId}?`
        )
      ) {
        fetch(`http://localhost:8080/api/users/delete/${userId}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            alert('Usuario eliminado');
            location.reload();
          })
          .catch((error) => console.error('Error:', error));
      }
    });
  });

  //*CHANGE ROL BUTTON

  //! Obtener todos los botones con la clase 'role-button'
  const roleButtons = document.querySelectorAll('.role-button');

  //! Añadir event listener a cada botón de cambio de rol
  roleButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const userId = button.getAttribute('data-id');

      fetch(`http://localhost:8080/api/users/premium/${userId}`, {
        method: 'PUT',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert('Se ha cambiado el rol de usuario');
          location.reload();
        })
        .catch((error) => console.error('Error:', error));
      console.log(`ESTO ES EL ID DEL BOTON: ${userId}`);
    });
  });
});
