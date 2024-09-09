(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getInsertVdoHandler(body = {}, token) {
    return axios({
      method: "post",
      url: `https://sls-report-api.945.report/api/v1/vdo/insert`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getChannel(token) {
    return axios({
      method: "get",
      url: `https://sls-report-api.945.report/api/v1/channel/list`,
      headers: { "x-auth-token": token },
    });
  }
  function getvdo(token) {
    return axios({
      method: "get",
      url: `https://sls-report-api.945.report/api/v1/product/list`,
      headers: { "x-auth-token": token },
    });
  }

  const services = {
    getChannel,
    getvdo,
    getInsertVdoHandler,
  };
  window.services = services;
})(jQuery, window, axios);
