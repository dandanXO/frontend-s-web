const domain = process.env.VUE_APP_EVT_API || process.env.EVT_API
const ns = `${domain}bonus`

export default {
    claim: `${ns}/claim`,
}