import { useMutation, useQuery } from "@tanstack/react-query"
import type { UserLogin } from "../Types/types"
import { authService } from "../../../../api/service/auth/authService"

export const useLogin = () =>{
    return useMutation({
        mutationFn: async (Logindata: UserLogin) =>{
            const data = await authService.login(Logindata);
            return data;
        }
    })
}
