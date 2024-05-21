import cron from 'node-cron';
import { options } from '../app.js';
import MailingService from './mailing.js';
import UserManager from '../DAO/MongoDb/UserManager.js';
const userManager = new UserManager();

export const delete_inactive_user = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const usersToDelete = await userManager.lastConnectionDelete();

      if (usersToDelete.length === 0) {
        return console.log({
          message: 'No hay usuarios cuya conexion sea menor a dos días',
        });
      }

      let emailList = usersToDelete.map((ele) => {
        return ele.email;
      });

      let emailString = emailList.join(',');

      const mailingService = new MailingService(options);
      await usersToDelete.forEach((ele) => userManager.deleteUser(ele._id));

      await mailingService.sendSimpleMail({
        from: 'Coderhouse',
        to: emailString,
        subject: 'Cuenta eliminada',
        html: `
          Tu cuenta ha sido eliminada por inactividad
          `,
      });

      console.log({ message: 'Users deleted', payload: usersToDelete });
    } catch (error) {
      console.log(`Error lastConnectionDelete: ${error}`);
    }
  });
};
