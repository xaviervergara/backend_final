import TicketManager from '../DAO/MongoDb/TicketManager.js';

//!Instanciamos la clase
const ticketManager = new TicketManager();

//*GET + get con id

export const getTickets_service = async (req, res) => {
  const { tId } = req.params;
  try {
    const tickets = await ticketManager.getTickets();
    if (!tickets) {
      return res.status(404).send({ message: 'Could not get tickets' });
    }
    if (!tId) {
      return res.send({ tickets });
    }
    const ticketById = ticketManager.getTicketById(tId);
    return res.send(ticketById);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//*POST

export const createTicket_service = async (req, res) => {
  const { ticket } = req.body;
  try {
    const result = await ticketManager.saveTicket(ticket);
    if (!result) {
      return res.status(400).send(`Resource could not be created`);
    }
    return res.status(201).send({ message: 'Resource created successfully' });
  } catch (error) {
    res.send({ message: error });
  }
};

//*PUT

export const updateTicket_service = async (req, res) => {
  const { tId } = req.params;
  const newTicket = req.body;

  try {
    const result = await ticketManager.updateTicket(tId, newTicket);
    if (!result) {
      return res.status(404).send({ message: `Could not update resource` });
    }
    return res.send({ message: 'Resourse has been updated' });
  } catch (error) {
    res.send({ message: error });
  }
};

//*DELETE

export const deleteTicket_service = async (req, res) => {
  const { tId } = req.params;
  try {
    const result = await ticketManager.deleteTicket(tId);
    if (!result) {
      return res.status(404).send({ message: 'Could not delete resource' });
    }
    return res.status({ message: 'The resource has been deleted' });
  } catch (error) {
    res.send({ message: error });
  }
};
