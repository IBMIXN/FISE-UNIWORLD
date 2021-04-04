import { axiosConfig } from "../config";

class BlobService {
  url = "/blobs";

  async get(container) {
    return (await axiosConfig.get(`${this.url}/${container}`)).data.blobs;
  }

  async upload(data, container) {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return (await axiosConfig.post(`${this.url}/${container}`, data, config)).data.url;
  }

  async delete(fileName, container) {
    const data = { fileName };
    return await axiosConfig.delete(`${this.url}/${container}`, { data });
  }

  async deleteSlides(fileName, numSlides) {
    const data = { fileName, numSlides };
    return await axiosConfig.delete(`${this.url}/slides`, { data });
  }
}

export default new BlobService();
