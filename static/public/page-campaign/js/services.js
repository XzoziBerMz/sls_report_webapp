
(function ($, window, axios) {
    const endpoint = {
        get_channel: `/api/v1/channel/list`,
        get_shop: `/api/v1/shop/list`,
        insert_data: `/api/v1/ads/campaign/insert`,

    }

    function getChannel(token) {
        console.log(window.csrfToken)
        return axios({
            method: 'get',
            url: basepath + endpoint.get_channel,
            headers: { "x-auth-token": token },
        });
    }
    function getShop(body = {}, token) {
        console.log(window.csrfToken)
        return axios({
            method: 'post',
            url: basepath + endpoint.get_shop,
            data: { ...body },
            headers: { "x-auth-token": token },
        });
    }
    function insertData(body = {}, token) {
        console.log(window.csrfToken)
        return axios({
            method: 'post',
            url: basepath + endpoint.insert_data,
            data: { ...body },
            headers: { "x-auth-token": token },
        });
    }
    const services = {
        getChannel,
        getShop,
        insertData,
    };
    window.services = services;
})(jQuery, window, axios);