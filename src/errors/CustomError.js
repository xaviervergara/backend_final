export default class CustomErrors {
  static createError({ name = 'Error', cause, message, code = 1 }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    throw error;
  }
}

//!El metodo "createError", es estatico. Eso siginifica que se va a poder utilizar sin instanciar la clase "CustomErrors" (const customErrors = new CustomErrors()/ customErrors.createError({...}))
//!Pero no hay que olvidar importar la clase en el archivo donde vayamos a utilizar dicho metodo!
