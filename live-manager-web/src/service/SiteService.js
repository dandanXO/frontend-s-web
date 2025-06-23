import { globals } from '../main'
const token = `Bearer ${sessionStorage.getItem('token')}`
export const SiteService = {
  getSiteTimeZoneById: (id) => {
    
    const baseApi = globals;
    const url = `${baseApi}/site/getTimeZoneById?id=${id}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': token,
      }
    };

    return fetch(url, requestOptions)
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

