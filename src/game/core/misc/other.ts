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
    const widthArray = new Array(Math.floor(width));
    // eslint-disable-next-line no-param-reassign
    widthArray.forEach((w) => w.push(new Array(Math.floor(height)).forEach((ww) => ww = 0)));
    return widthArray;
}


export default openExternalLink;
