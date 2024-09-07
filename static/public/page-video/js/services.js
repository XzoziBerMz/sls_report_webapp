(function ($, window, axios) {
  const basepath = "https://sls-report-api.945.report";
  const endpoint = {
    get_order: `/api/v1/vdo/filter`,
    get_product: `/api/v1/vdo/list-product`,
    get_channel: `/api/v1/vdo/list-channel`,
    get_user: `/api/v1/vdo/list-save-by`,
  };

  function getOrder(body = {}, token) {
    // return axios.get(`/page-key-order/mockjson/get_order.json`)
    return axios({
      method: "post",
      url: basepath + endpoint.get_order,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getProduct(token) {
    // return axios.get(`/page-key-order/mockjson/get_order.json`)
    return axios({
      method: "get",
      url: basepath + endpoint.get_product,
      headers: { "x-auth-token": token },
    });
  }
  function getChannel(token) {
    // return axios.get(`/page-key-order/mockjson/get_order.json`)
    return axios({
      method: "get",
      url: basepath + endpoint.get_channel,
      headers: { "x-auth-token": token },
    });
  }
  function getUser(token) {
    // return axios.get(`/page-key-order/mockjson/get_order.json`)
    return axios({
      method: "get",
      url: basepath + endpoint.get_user,
      headers: { "x-auth-token": token },
    });
  }
  const services = {
    getOrder,
    getProduct,
    getChannel,
    getUser,
  };
  window.services = services;
})(jQuery, window, axios);
