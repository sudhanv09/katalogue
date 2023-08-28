import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({params}) => {
    const readReq = await fetch(`http://localhost:5050/read/7?id=${params.readId}`);
    
    return {body: readReq.text()};
};