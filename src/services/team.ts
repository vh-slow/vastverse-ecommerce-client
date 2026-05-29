import axiosInstance, { UPLOAD_CONFIG } from './axios';

export const apiTeam = {
    getTeamMembersPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/team-members`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error(
                'Error fetching team members pagination for admin: ',
                e
            );
            throw e;
        }
    },

    deleteTeamMember: async (id: any) => {
        try {
            const response = await axiosInstance.delete(
                `api/admin/team-members/${id}`
            );
            return response.data;
        } catch (e) {
            console.error('Error deleting team member: ', e);
            throw e;
        }
    },

    restoreTeamMember: async (id: any) => {
        try {
            const response = await axiosInstance.patch(
                `api/admin/team-members/${id}/restore`
            );
            return response.data;
        } catch (e) {
            console.error('Error restoring team member: ', e);
            throw e;
        }
    },

    createTeamMember: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/team-members`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (e) {
            console.error('Error creating team member: ', e);
            throw e;
        }
    },

    getTeamMemberById: async (id: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/team-members/${id}`
            );
            return response.data.data;
        } catch (e) {
            console.error('Error fetching team member by id: ', e);
            throw e;
        }
    },

    updateTeamMember: async (id: any, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/team-members/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (e) {
            console.error('Error updating team member: ', e);
            throw e;
        }
    },
};
