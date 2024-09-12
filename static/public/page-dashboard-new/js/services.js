
(function ($, window, axios) {

    const endpoint = {
        // getReview: `/page-dashboard-new/mockjson/get_review.json`,

    }

    function getClip(body = {},token) {
        return axios({
            method: 'post',
            url: basepath + `/api/v1/vdo/filter`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    function getProductChannel(body = {}) {
        return axios.get(`/page-dashboard-new/mockjson/product_channel.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getReview,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }

    function getReview(body = {},token) {
        return axios({
            method: 'post',
            url: basepath + `/api/v1/review/filter-daily`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    function getReviewTb2(body = {},token) {
        return axios({
            method: 'post',
            url: basepath + `/api/v1/review/filter-negative`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    function getDailySum(body = {},token) {
        return axios({
            method: 'post',
            url: basepath + `/api/v1/chat/daily-sum`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    function getlog(body = {},token) {
        return axios({
            method: 'post',
            url: basepath + `/api/v1/log/filter`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    function getUpdateActionReviewNegativeHandler(body = {},token) {
        return axios({
            method: 'post',
            url: basepath + `/api/v1/review/update-action-negative`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    function getOrderManual(body = {}, token) {
        return axios({
          method: "post",
          url: basepath + `/api/v1/order/filter-manual`,
          // url: endpoint.getKeyReview,
          // url: basePath + endpoint.getKeyReview,
          data: { ...body },
          headers: { "x-auth-token": token },
        });
      }


    const services = {
        getUpdateActionReviewNegativeHandler,
        getDailySum,
        getReviewTb2,
        getReview,
        getProductChannel,
        getClip,
        getlog,
        getOrderManual,
    };
    window.services = services;
})(jQuery, window, axios);