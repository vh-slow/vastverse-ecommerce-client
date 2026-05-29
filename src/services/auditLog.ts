import axiosInstance from './axios';

export const apiAuditLog = {
    getAuditLogsPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/audit-logs`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error(
                'Error fetching audit logs pagination for admin: ',
                e
            );
            throw e;
        }
    },
};
