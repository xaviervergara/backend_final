//!Logica boton logout
logoutBtn.addEventListener('click', async (event) => {
  const result = await fetch('http://localhost:8080/api/sessions/logout', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });

  const { redirect } = await result.json();
  window.location.href = redirect; //averiguar por esto
});

//! __________________________________
//!Logica change rol button

switchRole_btn.addEventListener('click', async (event) => {
  const userInfoContainer = document.querySelector('.userInfoContainer');
  const userId = userInfoContainer.getAttribute('data-user-id');

  const response = await fetch(
    `http://localhost:8080/api/users/premium/own-role/${userId}`,
    {
      method: 'PUT',
    }
  );

  alert('Se ha cambiado el rol de usuario');
  location.reload();

  console.log(response);
});
