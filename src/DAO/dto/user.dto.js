import { createHash } from '../../utils/bcyrpt.js';

class UserDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = createHash(user.password);
    this.role = true;
    this.cart = user.cart;
  }

  getCurrentUser() {
    return {
      fullName: this.first_name + ' ' + this.last_name,
      email: this.email,
      role: this.role,
      cart: this.cart,
    };
  }
}
//!NO IMPLEMENTADO. EN SESSION.SERVICE YA SE PASA EL USUARIO A LA SESION SIN DATOS SENSIBLES
export default UserDTO;
