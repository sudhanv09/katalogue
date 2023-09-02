import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({params}) => {
    const readReq = await fetch(`http://localhost:5050/read/start?id=${params.readId}`);  
    const bookcss = await fetch(`http://localhost:5050/read/book-css?id=${params.readId}`);
    return {
        content: readReq.text(),
        css: bookcss.text()
    };
};