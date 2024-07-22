import { logger } from "../util/logger.js";
import ticketModel from "./models/ticket.model.js";

class TicketsDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }

  create = async (ticketData) => {
    try {
      const result = await ticketModel.create(ticketData);
      return result;
    } catch (error) {
      logger.error('Error creating ticket:', error);
      throw error;
    }
  };

  getBy = async (filter) => {
    try {
      const result = await ticketModel.findOne(filter).lean();
      return result;
    } catch (error) {
      logger.error('Error getting ticket by filter:', error);
      throw error;
    }
  };

  getAll = async (filter) => {
    try {
      const result = await ticketModel.find(filter).lean();
      return result;
    } catch (error) {
      logger.error('Error getting all tickets:', error);
      throw error;
    }
  };

  remove = async (filter) => {
    try {
      const result = await ticketModel.deleteOne(filter);
      return result;
    } catch (error) {
      logger.error('Error removing ticket:', error);
      throw error;
    }
  };
}

export default TicketsDaoMongo;
