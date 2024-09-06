
(function ($, window, axios) {
    const endpoint = {
        getPokemon: `/get-pokemon`,

    }

    function getOrderManual(body = {}, token) {

        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/order/filter-manual`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }


    function getOrder(body = {}) {
        return axios.get(`/page-key-order/mockjson/get_order.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    const services = {
        getOrder,
        getOrderManual,
    };
    window.services = services;
})(jQuery, window, axios);