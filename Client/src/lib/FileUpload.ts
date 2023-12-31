import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

export async function handleFileUpload(e: Event) {
	const files = (e.target as HTMLInputElement).files;
	if (!files) return;

	let formData = new FormData();
	Array.from(files).forEach((f) => {
		formData.append('file', f);
	});

	const req = await fetch('http://localhost:5050/upload', {
		method: 'POST',
		body: formData,
		headers: {
			accept: '*/*'
		}
	});
	const response = await req.json();

	const toastStore = getToastStore();
	if (response.success) {
		const t: ToastSettings = {
			message: response.successMessage,
			background: 'variant-filled-success'
		};
		toastStore.trigger(t);
	} else {
		if (response.errorCode == 3) {
			const t: ToastSettings = {
				message: response.error,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	}
}
