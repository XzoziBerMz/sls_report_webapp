
(function ($, window, axios) {
    const endpoint = {
        get_product: `/api/v1/product/list`,
        get_shop: `/api/v1/shop/list`,
        insert_data: `/api/v1/ads/insert`,
        update_data: `/api/v1/ads/update`,
        get_ads: `/api/v1/ads/filter`,

      
        get_channel: `/api/v1/shop/list`,
        get_InsertMultiple: `/api/v1/tiktok-live/insert-multiple`,
    }

    function getInsertMultiple(body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_InsertMultiple,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    function getChannel(body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.get_channel,
            data: {...body},
            headers: { "x-auth-token": token },
        });
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
    function updateData(body = {}, token) {
        return axios({
            method: 'post',
            url: basepath + endpoint.update_data,
            data: {...body},
            headers: { "x-auth-token": token },
        });
    }
    const services = {
        
        getChannel,
        getInsertMultiple,

        getAds,
        getProduct,
        getShop,
        insertData,
        updateData,
    };
    window.services = services;
})(jQuery, window, axios);