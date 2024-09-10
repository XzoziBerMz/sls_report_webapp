(function ($, window, axios) {
  // const basepath = "https://sls-report-api.945.report";
  const basepath = "http://127.0.0.1:4444";
  const endpoint = {
    get_channel: `/api/v1/channel/list`,
    get_product: `/api/v1/product/list`,
    insert_data: `/api/v1/review/insert-negative`
  };

  function getInsertReviewDailyHandler(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + endpoint.insert_data,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getChannel(token) {
    return axios({
      method: "get",
      url: basepath + endpoint.get_channel,
      headers: { "x-auth-token": token },
    });
  }

  function getProduct(token) {
    return axios({
      method: "get",
      url: basepath + endpoint.get_product,
      headers: { "x-auth-token": token },
    });
  }

  const services = {
    getProduct,
    getChannel,
    getInsertReviewDailyHandler,
  };
  window.services = services;
})(jQuery, window, axios);
