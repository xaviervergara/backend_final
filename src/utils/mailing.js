import mailer from 'nodemailer';
import { getVariables } from '../config/dotenv.config.js';
import { options } from '../app.js';

// const { mailingService, mailingUser, mailingPassword } = getVariables(options);

export default class MailingService {
  constructor(options) {
    const { mailingService, mailingUser, mailingPassword } =
      getVariables(options);
    this.client = mailer.createTransport({
      service: mailingService,
      port: 587, //!puerto de smtp, (protocolo simple mail transfer protocol. ESTO ES ESTANDAR)
      auth: {
        user: mailingUser,
        pass: mailingPassword,
      },
    });
  }

  sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
    const result = await this.client.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
    return result;
  };
}
