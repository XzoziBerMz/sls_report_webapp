(function ($, window, axios) {
  const endpoint = {
    // getReview: `/page-dashboard-new/mockjson/get_review.json`,
  };

  function getClip(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/vdo/filter`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getProductChannel(body = {}) {
    return axios.get(`/page-dashboard-new/mockjson/product_channel.json`);
    // return axios({
    //     method: 'post',
    //     url: endpoint.getReview,
    //     data: { ...body },
    //     headers: { "x-auth-token": window.csrfToken }
    // });
  }

  function getReview(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/review/filter-daily`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getReviewTb2(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/review/filter-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getDailySum(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/chat/daily-v2-sum`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getlog(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/log/filter`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getUpdateActionReviewNegativeHandler(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/review/update-action-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
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
  function getShopTT(body = {}, token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/review/list-channel-daily`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function ListChannelReviewNegative(body = {}, token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/review/list-channel-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function listChannel(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/channel/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getProduct(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/vdo/list-product`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getChannel(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/vdo/list-channel`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getUser(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/vdo/list-save-by`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function ListUserByReviewNegative(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/review/list-user-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function ListInfractionReviewDaily(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/review/list-infraction-daily`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getProductAll(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/product/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function ListProductReviewNegative(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/review/list-product-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getChannelAll(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/channel/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getmanual(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/order/list-product-manual`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  function getChannelShop(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/review/list-channel-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }
  // function getUserAll(token) {
  //     return axios({
  //         method: "get",
  //         url: basepath + `/api/v1/vdo/list-save-by`,
  //         // url: endpoint.getKeyReview,
  //         // url: basePath + endpoint.getKeyReview,
  //         headers: { "x-auth-token": token },
  //     });
  // }

  const services = {
    getUpdateActionReviewNegativeHandler,
    getDailySum,
    getReviewTb2,
    getReview,
    getProductChannel,
    getClip,
    getlog,
    getOrderManual,
    listChannel,
    getProduct,
    getChannel,
    getUser,
    getProductAll,
    getChannelAll,
    getShopTT,
    getmanual,
    getChannelShop,
    ListChannelReviewNegative,
    ListProductReviewNegative,
    ListUserByReviewNegative,
    ListInfractionReviewDaily,
    // getUserAll,
  };
  window.services = services;
})(jQuery, window, axios);
