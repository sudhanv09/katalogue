import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {	
	const readReq = await fetch(`http://localhost:5050/read/start?id=${params.readId}`);
	
	return {
		content: await readReq.text(),
	};
};
