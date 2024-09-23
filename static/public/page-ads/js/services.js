
(function($, window, axios) {
    const endpoint = {
        get_ads:`/api/v1/ads/tiktok/filter`,
        get_ads_cost:`/api/v1/ads/cost/filter`,
        update_ads:`/api/v1/ads/update`,
        get_tiktok_live:`/api/v1/tiktok-live/filter`,
        get_tiktok_shop:`/api/v1/tiktok-live/list-shop`,
        
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
    function getTiktokLive (body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_tiktok_live,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    function getShopTT (token) {
        return axios({
            method: 'get',
            url: basepath + endpoint.get_tiktok_shop,
            // data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    function updateData (body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.update_ads,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    const services = {
        getAdsApi,
        getAdsCost,
        updateData,
        getTiktokLive,
        getShopTT,
    };
    window.services = services;
})(jQuery, window, axios);