const domain = process.env.VUE_APP_RST_API || process.env.RST_API
const ns = `${domain}bonus`

export default {
    claim: `${ns}/claim`,
}