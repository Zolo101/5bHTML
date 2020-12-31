const nodeEnv = (process.env.NODE_ENV === "development") ? true : false

const Settings = {
    IS_DEBUG: nodeEnv
}

export default Settings