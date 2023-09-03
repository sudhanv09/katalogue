/**
 * Retrieves the next chapter from the given URL.
 *
 * @param {string} url - The URL of the chapter.
 * @return {Promise<string>} A promise that resolves to the chapter data.
 */
export async function nextChapter(url: string){
    const req = async () => {
        const getData = await fetch(url);
        const data = await getData.text();
        return data;
    };

    return req()
}   
