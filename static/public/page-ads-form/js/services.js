
(function ($, window, axios) {
    const endpoint = {
        get_product: `/api/v1/product/list`,
        get_shop: `/api/v1/shop/list`,
        insert_data: `/api/v1/ads/insert`,
        get_ads: `/api/v1/ads/filter`,
    }

    function getAds(body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_ads,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }

    function getProduct(token) {
        return axios({
            method: 'get',
            url: basepath + endpoint.get_product,
            // data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    function getShop(body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_shop,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    function insertData(body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.insert_data,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    const services = {
        getAds,
        getProduct,
        getShop,
        insertData,
    };
    window.services = services;
})(jQuery, window, axios);