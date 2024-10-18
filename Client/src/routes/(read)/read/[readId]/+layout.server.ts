import type { Book } from '$src/lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {	
	const readReq = await fetch(`http://localhost:5050/read/start?id=${params.readId}`);
	const title: Book = await fetch(`http://localhost:5050/library/${params.readId}`).then((res) => res.json());
	
	return {
		content: await readReq.text(),
		info: await title
	};
};
