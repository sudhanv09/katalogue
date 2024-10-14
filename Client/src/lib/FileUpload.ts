import { toast } from "svelte-sonner"

export async function handleFileUpload(files: FileList | null) {

	if (files === null || files.length === 0) {
		toast.error("No file selected");
		return;
	}
	
	const formData = new FormData();
	for (const f of Array.from(files)) {
		formData.append('file', f);
	}

	const req = await fetch('http://localhost:5050/upload', {
		method: 'POST',
		body: formData,
		headers: {
			accept: '*/*'
		}
	});
	if (req.ok) {
		toast.success("File Upload success");
	} else {
		toast.error("Upload failed. Try again!");
	}
}
