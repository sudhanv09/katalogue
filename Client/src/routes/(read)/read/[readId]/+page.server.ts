import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {	
	const readReq = await fetch(`http://localhost:5050/read/start?id=${params.readId}`);
	// const bookToc = await fetch(`http://localhost:5050/read/toc?id=${params.readId}`);
	
	return {
		content: readReq.text(),
		// toc: bookToc.text(),
	};
};
