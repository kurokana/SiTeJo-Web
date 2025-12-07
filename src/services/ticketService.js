import api from './api';

export const ticketService = {
    getTickets: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if(filters[key]){
                    params.append(key, filters[key]);
                }
            });

            const queryString = params.toString();
            const url = queryString ? `/tickets?${queryString}` : '/tickets';

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

    getLecturers: async () => {
        try {
            return await api.get('/tickets/lecturers');
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

    createTicket: async (ticketData) => {
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
            return await api.post(`/tickets/${Id}/review`, { lecturer_notes: notes });
        } catch (error) {
            throw error;
        }
    },

    approveTicket: async (Id, notes) => {
        try {
            return await api.post(`/tickets/${Id}/approve`, { lecturer_notes: notes });
        } catch (error) {
            throw error;
        }
    },

    rejectTicket: async (Id, reason) => {
        try {
            return await api.post(`/tickets/${Id}/reject`, { rejection_reason: reason });
        } catch (error) {
            throw error;
        }
    },

    sendToLecturer: async (Id, notes) => {
        try {
            return await api.post(`/tickets/${Id}/send-to-lecturer`, { admin_notes: notes });
        } catch (error) {
            throw error;
        }
    },

    adminRejectTicket: async (Id, reason) => {
        try {
            return await api.post(`/tickets/${Id}/reject`, { rejection_reason: reason });
        } catch (error) {
            throw error;
        }
    },

    completeTicket: async (Id, notes) => {
        try {
            return await api.post(`/tickets/${Id}/complete`, { admin_notes: notes });
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