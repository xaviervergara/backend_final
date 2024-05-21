import { ticketModel } from '../models/ticket.model.js';

let date = new Date().toLocaleDateString();
let hour = new Date().toLocaleTimeString();

// console.log(date, hour);

class TicketManager {
  constructor() {}

  //*GET

  async getTickets() {
    try {
      const result = await ticketModel.find();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //*GET BY ID

  async getTicketById(id) {
    try {
      const result = await ticketModel.findOne({ _id: id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //*SAVE TICKET

  async saveTicket(ticket) {
    try {
      ticket.code = Math.floor(Math.random() * Date.now());
      ticket.purchase_datetime = `Created at: ${hour} ${date}`;

      const result = await ticketModel.create(ticket);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //*UPDATE TICKET
  async updateTicket(id, ticket) {
    try {
      const result = await ticketModel.updateOne({ _id: id }, { $set: ticket }); //! set, setea el nuevo valor en el id matcheado en el anterior parametro
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //*DELETE
  async deleteTicket(id) {
    try {
      const result = await ticketModel.deleteOne({ _id: id });
      return;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default TicketManager;
