import api from './api';

export const ticketService = {
    getTickets: async (params) => {
        try {
            const params = new URLSearchParams;
            
            object.keys(filters).foreach(key => {
                if(filters[key]){
                    params.append(key, filters[key]);
                }
            });

            const queryString = params.toString();
            const url = queryString ? '/tickets?${queryString}' : '/tickets';

            return await api.get(url);
        } catch (error) {
            throw error;
        }
    },

    getStatistics: async () => {
        try {
            return await api.get('/tickets/statistics');
        } catch (error) {
            throw error;
        }
    },

    getTicketById: async (Id) => {
        try {
            return await api.get(`/tickets/${Id}`);
        } catch (error) {
            throw error;
        }
    },

    createTiket: async (ticketData) => {
        try {
            return await api.post('/tickets', ticketData);
        } catch (error) {
            throw error;
        }
    },

    updateTicket: async (Id, ticketData) => {
        try {
            return await api.put(`/tickets/${Id}`, ticketData);
        } catch (error) {
            throw error;
        }
    },

    reviewTicket: async (Id, notes) => {
        try {
            return await api.post(`/tickets/${Id}/review`, { notes });
        } catch (error) {
            throw error;
        }
    },

    rejectTikect: async (Id, reason) => {
        try {
            return await api.post(`/tickets/${Id}/reject`, { reason });
        } catch (error) {
            throw error;
        }
    },

    completeTicket: async (Id) => {
        try {
            return await api.post(`/tickets/${Id}/complete`);
        } catch (error) {
            throw error;
        }
    },

    deleteTicket: async (Id) => {
        try {
            return await api.delete(`/tickets/${Id}`);
        } catch (error) {
            throw error;
        }
    },
};