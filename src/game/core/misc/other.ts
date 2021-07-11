// misc stuff

export function openExternalLink(url: string): void {
    window.open(url, "_blank");
}

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

export function create2DNumberArray(width: number, height: number): number[][] {
    const newArray = [...new Array(Math.floor(height))].map(() => new Array(Math.floor(width)).fill(-2))
    // console.log(newArray)
    return newArray;
}

export function padStart(num: number | string, amount: number, pad = "0"): string {
    const str = num.toString();
    return pad.repeat(amount - str.length) + str;
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
    const resultData: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        resultData.push(arr.slice(i, i + size));
    } // chunks

    return resultData;
}

export function truncate(str: string, max: number): string {
    if (str.length > max) {
        return `${str.substring(0, max).trimEnd()}...`
    } else {
        return str
    }
}

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

export default openExternalLink;
