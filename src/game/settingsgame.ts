const nodeEnv = (import.meta.env.NODE_ENV === "development") ? true : false
const settingsBuffer = localStorage.getItem("settings");
let Settings = {
    IS_DEBUG: nodeEnv,
    MENU_OLD: false,
}

if (settingsBuffer !== null) Settings = JSON.parse(settingsBuffer)
console.log(Settings)

export default Settings