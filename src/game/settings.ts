let nodeEnv = false
if (process.env.NODE_ENV === "development") nodeEnv = true;

const Settings = {
    IS_DEBUG: nodeEnv
}

export default Settings