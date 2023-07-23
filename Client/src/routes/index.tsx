export default function Home() {

function handleUploadFile(event ) {
  const file = event.target.files[0];
  
}
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Hello world!
      </h1>
      <form action="post" enctype="multipart/form-data">
        <label for="epub-file">File</label>
        <input id="epub-file" type="file" />
        <button onclick={handleUploadFile}>Upload</button>
      </form>
    </main>
  );
}
