const axiosClient = require('./axiosClient');

const personApi = {
  getById(id) {
    const url = `/person/${id}`;
    return axiosClient.get(url);
  }
};

module.exports = personApi;