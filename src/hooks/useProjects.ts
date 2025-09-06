import { getProjects } from "@/libs/posts"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useProject = ({categories = []}: {categories?: string []}) => {
    const cats = categories.filter(it=> !!it);
    console.log(cats, categories);
    return useInfiniteQuery({
        queryKey: ['projects',...cats ],
        queryFn:  ({ pageParam  = 0 })=> getProjects({page: pageParam, pageSize: 6,categories: cats}),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 6 ) return undefined;
            return allPages.length; 
          },

    })
}