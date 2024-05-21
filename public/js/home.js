//! CODIGO ORIGINAL
// let resource_url;

// fetch('http://localhost:8080/api/resources-url', {
//   method: 'GET',
// })
//   .then((response) => response.json())
//   .then((data) => {
//     resource_url = data;
//     console.log(`Esto es resource url: ${resource_url}`);
//   })
//   .catch((error) => console.error('Error:', error));

// console.log(`Esto es resource url PUTOOO: ${resource_url}`);

// //!Logica boton logout
// logoutBtn.addEventListener('click', async (event) => {
//   const result = await fetch('http://localhost:8080/api/sessions/logout', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//   });

//   const { redirect } = await result.json();
//   window.location.href = redirect; //averiguar por esto
// });

// //! __________________________________
// //!Logica change rol button

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

//*____________________________________________________________________________________
//!!ESTE SI FUNCIONA, ES EL NUEVO
// let resource_url;
// async function fetchResourceUrl() {
//   try {
//     const response = await fetch('http://localhost:8080/api/resources-url', {
//       method: 'GET',
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error:', error);
//     return null;
//   }
// }

import fetchResourceUrl from './utils.js';

async function init() {
  let resource_url = await fetchResourceUrl();

  if (resource_url) {
    console.log(`Esto es resource url: ${resource_url}`);

    // //!Logica boton logout

    logoutBtn.addEventListener('click', async (event) => {
      const result = await fetch(`${resource_url}/api/sessions/logout`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
      });

      const { redirect } = await result.json();
      window.location.href = redirect;
    });
  } else {
    console.error('No se pudo obtener resource_url');
  }

  // //!Logica change rol button

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
}

init();
