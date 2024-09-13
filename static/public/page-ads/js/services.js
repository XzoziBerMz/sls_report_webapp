
(function($, window, axios) {
    const endpoint = {
        get_ads:`/api/v1/ads/filter`,
        get_ads_cost:`/api/v1/ads/cost/filter`,
        
    }
    
    function getAdsApi (body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_ads,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    function getAdsCost (body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_ads_cost,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    const services = {
        getAdsApi,
        getAdsCost,
    };
    window.services = services;
})(jQuery, window, axios);