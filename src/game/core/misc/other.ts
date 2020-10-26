// misc stuff

export function openExternalLink(url: string): void {
    window.open(url, "_blank");
}

export function hexColourFromSeed(seed: number): string {
    // This isnt random, do not use it for when things need to be random
    let finalHex = ""
    for (let i = 0; i < 6; i++) {
        const genNumber = Math.abs(Math.floor(Math.sin(seed + i) * 15))
        finalHex = finalHex + genNumber.toString(16)
    }
    // console.log(finalHex)
    return "#" + finalHex;
}

export default openExternalLink;
