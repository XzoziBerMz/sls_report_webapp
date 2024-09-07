(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getInsertReviewDailyHandler(body = {}, token) {
    return axios({
      method: "post",
      url: `https://sls-report-api.945.report/api/v1/review/insert-negative`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getChannel(body = {}) {
    return axios({
      method: "get",
      url: `https://sls-report-api.945.report/api/v1/channel/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: {},
    });
  }

  function getProduct(body = {}) {
    return axios({
      method: "get",
      url: `https://sls-report-api.945.report/api/v1/product/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: {},
    });
  }

  const services = {
    getProduct,
    getChannel,
    getInsertReviewDailyHandler,
  };
  window.services = services;
})(jQuery, window, axios);
