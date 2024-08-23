
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


    function getClip(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjson/get_clip.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getReview,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
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

    function getReview(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjson/get_review.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getReview,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }

    function getReviewTb2(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjson/get_reviewTb2.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getReview,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
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
        getOrder,
    };
    window.services = services;
})(jQuery, window, axios);