import api from './api';

export const documentService = {
    getDocumentsByTicket: async (ticketId) => {
        try {
            return await api.get(`/tickets/${ticketId}/documents`);
        } catch (error) {
            throw error;
        }
    }, 

    uploadDocument: async (ticketId, file, documentsType) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentsType', documentsType);

            return await api.post('/tickets/${ticketId}/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            throw error;
        }
    },

    downloadDocument: async (documentId) => {
        try {
            const response = await api.get(`/documents/${documentId}/download`, {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    deleteDocument: async (documentId) => {
        try {
            return await api.delete(`/documents/${documentId}`);
        } catch (error) {
            throw error;
        }
    },
};