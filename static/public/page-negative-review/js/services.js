
(function ($, window, axios) {

    const basePath = 'http://127.0.0.1:4444'
    const endpoint = {
         getKeyReview:`/api/v1/review/filter-negative`,
        // getKeyReview: `/negatvie-list`,

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

    function getMatterViolation(body = {}) {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:4444/api/v1/review/list-infraction-daily`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: {}
        });
    }

    function getInputChannel(body = {}) {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:4444/api/v1/review/list-channel-negative`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: {}
        });
    }

    const services = {
        getMatterViolation,
        getInputChannel,

        getKeyReview,
    };
    window.services = services;
})(jQuery, window, axios);