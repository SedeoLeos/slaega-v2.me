import { getAllCategories } from "@/libs/posts"
import {  useQuery } from "@tanstack/react-query"

export const useCategories = ()=> {
    return useQuery({
        queryKey: ['Categories'],
        queryFn:  getAllCategories
    }
        
    )
}