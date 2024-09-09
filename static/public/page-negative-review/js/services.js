
(function ($, window, axios) {

    const basePath = 'http://127.0.0.1:4444'
    const endpoint = {
         getKeyReview:`/api/v1/review/filter-negative`,
        // getKeyReview: `/negatvie-list`,

    }

    function createData(body = {}, token) {

        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/review/insert-daily`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    function getKeyReview(body = {}) {

        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/review/filter-negative`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: {}
        });
    }

    function getMatterViolation(token) {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:4444/api/v1/review/list-infraction-daily`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            // data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    function getInputChannel(token) {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:4444/api/v1/channel/list`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            // data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    const services = {
        createData,
        getMatterViolation,
        getInputChannel,

        getKeyReview,
    };
    window.services = services;
})(jQuery, window, axios);