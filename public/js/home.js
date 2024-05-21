import { options } from '../../src/app.js';
import { getVariables } from '../../src/config/dotenv.config.js';

const { apiUrl } = getVariables(options);

//!Logica boton logout
// logoutBtn.addEventListener('click', async (event) => {
//   const result = await fetch('http://localhost:8080/api/sessions/logout', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//   });

//   const { redirect } = await result.json();
//   window.location.href = redirect; //averiguar por esto
// });

logoutBtn.addEventListener('click', async (event) => {
  const result = await fetch(`${apiUrl}/api/sessions/logout`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });

  const { redirect } = await result.json();
  window.location.href = redirect; //averiguar por esto
});

//! __________________________________
//!Logica change rol button

// switchRole_btn.addEventListener('click', async (event) => {
//   const userInfoContainer = document.querySelector('.userInfoContainer');
//   const userId = userInfoContainer.getAttribute('data-user-id');

//   const response = await fetch(
//     `http://localhost:8080/api/users/premium/own-role/${userId}`,
//     {
//       method: 'PUT',
//     }
//   );

//   alert('Se ha cambiado el rol de usuario');
//   location.reload();

//   console.log(response);
// });
switchRole_btn.addEventListener('click', async (event) => {
  const userInfoContainer = document.querySelector('.userInfoContainer');
  const userId = userInfoContainer.getAttribute('data-user-id');

  const response = await fetch(
    `${apiUrl}/api/users/premium/own-role/${userId}`,
    {
      method: 'PUT',
    }
  );

  alert('Se ha cambiado el rol de usuario');
  location.reload();

  console.log(response);
});
