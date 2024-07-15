import ticketModel from "./models/ticket.model.js";

class TicketsDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }

  create = async (ticketData) => {
    // console.log('Creating ticket:', newTicket);
    // return await this.ticketModel.collection.insertOne(newTicket);
    try {
      // console.log('Creating ticket:', ticketData);
      const result = await ticketModel.create(ticketData);
      return result;
  } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
  }
  };

  getBy = async (filter) => {
    return ticketModel.findOne(filter).lean();
  };
  getAll = async (filter) => {
    return ticketModel.find(filter).lean();
  };

  remove = async (filter) => {
    return await ticketModel.deleteOne(filter);
  };
}

export default TicketsDaoMongo;