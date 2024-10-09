import { toast } from "svelte-sonner"

export async function handleFileUpload(e: Event) {
	e.preventDefault();

	const files = (e.target as HTMLInputElement).files;
	if (!files || files.length === 0) return;

	const formData = new FormData();
	for(const f of Array.from(files)) {
		formData.append('file', f);
	}

	const req = await fetch('http://localhost:5050/upload', {
		method: 'POST',
		body: formData,
		headers: {
			accept: '*/*'
		}
	});
	const response = await req.json();

	if (response.success) {
		toast.success("File Upload success");
	} else {
		toast.error("Upload failed. Try again!");
	}
}
