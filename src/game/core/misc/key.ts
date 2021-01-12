export class Key {
    code: string
    shift: boolean
    crtl: boolean
    alt: boolean
    constructor(code: string, crtl = false, shift = false, alt = false) {
        this.code = code;
        this.shift = shift;
        this.crtl = crtl;
        this.alt = alt;
    }

    change(code: string, crtl = false, shift = false, alt = false): void {
        this.code = code;
        this.shift = shift;
        this.crtl = crtl;
        this.alt = alt;
    }

    getName(): string {
        let name = "";
        if (this.shift) name += "Shift+";
        if (this.crtl) name += "Crtl+";
        if (this.alt) name += "Alt+";
        name += this.code;
        return name;
    }

    equals(key: Key): boolean {
        return (this.code === key.code)
            ? (this.shift === key.shift)
                ? (this.crtl === key.crtl)
                    ? (this.alt === key.alt) ? true
                        : false
                    : false
                : false
            : false
    }
}

export default Key;