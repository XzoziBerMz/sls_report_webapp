
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
    function getCaretaker(body = {}) {
        console.log(window.csrfToken)
        return axios.get(`/page-dashboard-new/mockjson/get_caretaker.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }

    const services = {
        getReview,
        getCaretaker,
        getClip,
        getProductChannel,
    };
    window.services = services;
})(jQuery, window, axios);