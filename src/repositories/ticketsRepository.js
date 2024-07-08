export default class TicketsRepository {
    constructor(ticketsDao) {
        this.ticketsDao = ticketsDao;
    }

    createTicket = async newTicket => await this.ticketsDao.create(newTicket);
    getTicket = async filter => await this.ticketsDao.getBy(filter);
    deleteTicket = async tid => await this.ticketsDao.remove(tid);
}