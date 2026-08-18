import type { User, UserLogin } from "../../../core/modules/auth/Types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithToken } from "../../Types/types.types";

export const authService = {
    login: (data: UserLogin) => apiClient.post<APIResponseWithToken<User>>('login' , data),
    logout: () => apiClient.post('logout'),
}