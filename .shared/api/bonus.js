import bonus from './endpoint/bonus'

export default {
    claim: claimType => fetch(`${bonus.claim}/${claimType}`, {
        method: 'PUT'
    })
}