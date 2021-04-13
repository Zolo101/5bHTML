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
    const newArray = [...new Array(Math.floor(height))].map(() => new Array(Math.floor(width)).fill(-1))
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

export default openExternalLink;
