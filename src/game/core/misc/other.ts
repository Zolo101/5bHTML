// misc stuff

/**
 * Opens a link in a new window
 * @param url The link to be opened
 */
export function openExternalLink(url: string): void {
    window.open(url, "_blank");
}

/**
 * Creates a hex colour based on a seed
 * @param seed The input the function uses to create the hex colour
 * @returns String of a hex colour
 */
export function hexColourFromSeed(seed: number): string {
    // This isnt random, do not use it for when things need to be random
    let finalHex = ""
    for (let i = 0; i < 6; i++) {
        const genNumber = Math.abs(Math.floor(Math.sin(Number(seed) + i) * 15))
        finalHex = finalHex + genNumber.toString(16)
    }
    // console.log(Number(seed.toString(9)))
    // console.log(finalHex)
    return "#" + finalHex;
}

/**
 * **DONT USE THIS FOR GENERAL USE**
 *
 * Creates a 2D array filled with numbers (-2).
 * @param width Width of the array
 * @param height Height of the array
 * @returns The 2D array, filled with -2
 */
export function create2DNumberArray(width: number, height: number): number[][] {
    return [...new Array(Math.floor(height))].map(() => new Array(Math.floor(width)).fill(-2))
}

/**
 * Creates a 2D array.
 *
 * The reason why you need to supply the data using a function is because of how referencing works in JS.
 * @param width Width of the array
 * @param height Height of the array
 * @param data Data to put in the array
 * @returns The 2D array filled with the data
 */
export function create2DArray<T>(width: number, height: number, data: () => T): T[][] {
    const result: T[][] = []
    for (let i = 0; i < height; i++) {
        result[i] = []
        for (let j = 0; j < width; j++) {
            result[i][j] = data()
        }
    }
    return result;
}

/**
 * Splits up arrays into chunks based on the size.
 * @param arr Array to split up
 * @param size Size of chunks
 * @returns Chunked Array
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
    const resultData: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        resultData.push(arr.slice(i, i + size));
    } // chunks

    return resultData;
}

/**
 * Truncates a string with a `...` if its length is longer than the max provided.
 * @param str String to truncate
 * @param max The max length the string can be before it gets truncated
 * @returns Truncated string
 */
export function truncate(str: string, max: number): string {
    if (str.length > max) {
        return `${str.substring(0, max).trimEnd()}...`
    } else {
        return str
    }
}

/**
 * Download data into file
 * @param data Data to download
 */
export function downloadFile(data: unknown): void {
    const blobedData = new Blob([JSON.stringify(data)], {type: "application/json"})
    const blobURL = window.URL.createObjectURL(blobedData)
    const a = document.createElement("a")
    a.href = blobURL;
    a.download = "5bhtml-levelpack.json"
    a.click()
    window.URL.revokeObjectURL(blobURL)
    a.remove()
}

/**
 * Allows user to upload a file
 * @returns Either a file or nothing (null)
 */
export function uploadFile(): Promise<FileList | null> {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.multiple = false;
    input.click()
    return new Promise((res) => {
        input.addEventListener("change", () => {
            res(input.files)
            input.remove()
        })
    })
}
