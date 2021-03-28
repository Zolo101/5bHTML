// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeEnv = (import.meta.env.NODE_ENV === "development")
const settingsBuffer = localStorage.getItem("settings");
let Settings = {
    IS_DEBUG: nodeEnv,
    MENU_OLD: false,
}

if (settingsBuffer !== null) Settings = JSON.parse(settingsBuffer)
console.log(Settings)

export default Settings