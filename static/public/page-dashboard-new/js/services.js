
(function ($, window, axios) {

    const endpoint = {
        getReview: `/page-dashboard-new/mockjson/get_review.json`,

    }

    // function getPokemon (body = {}) {
    //     console.log( window.csrfToken)
    //     return axios({
    //         method: 'post',
    //         url: endpoint.getPokemon,
    //         data: {...body},
    //         headers: {"X-Csrf-Token":window.csrfToken}
    //     });
    // }


    function getClip(body = {},token) {
        console.log(window.csrfToken)
        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/vdo/filter`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    function getProductChannel(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjson/product_channel.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getReview,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }

    function getReview(body = {},token) {
        console.log(window.csrfToken)
        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/review/filter-daily`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    function getReviewTb2(body = {},token) {
        console.log(window.csrfToken)
        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/review/filter-negative`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    function getDailySum(body = {},token) {
        console.log(window.csrfToken)
        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/chat/daily-sum`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    // function getUpdateActionReviewNegativeHandler(body = {},token) {
    //     console.log(window.csrfToken)
    //     return axios({
    //         method: 'post',
    //         url: `http://127.0.0.1:4444api/v1/review/update-action-negative`,
    //         // url: endpoint.getKeyReview,
    //         // url: basePath + endpoint.getKeyReview,
    //         data: { ...body },
    //         headers: { "x-auth-token": token }
    //     });
    // }

    function getTikTok(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjsonApp/get_tiktok.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getLaz(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjsonApp/get_laz.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getShoppee(body = {}) {
        return axios.get(`/page-dashboard-new/mockjsonApp/get_shoppee.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getFb(body = {}) {
        return axios.get(`/page-dashboard-new/mockjsonApp/get_fb.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getLine(body = {}) {
        return axios.get(`/page-dashboard-new/mockjsonApp/get_line.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getOrder (body = {}) {
        return axios.get(`/page-dashboard-new/mockjsonApp/get_amount_order .json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }


    const services = {
        getReview,
        getReviewTb2,
        getClip,
        getProductChannel,
        getTikTok,
        getLaz,
        getShoppee,
        getFb,
        getLine,
        getDailySum,
        getOrder,
        // getUpdateActionReviewNegativeHandler,
    };
    window.services = services;
})(jQuery, window, axios);