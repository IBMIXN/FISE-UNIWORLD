import { axiosConfig } from "../config";

class EventRoomService {
  url = "/eventrooms";

  async getAll() {
    return (await axiosConfig.get(`${this.url}?showDetails=true`)).data;
  }

  async get(id) {
    return (await axiosConfig.get(`${this.url}/${id}`)).data;
  }

  async create(data) {
    return (await axiosConfig.post(this.url, data)).data;
  }

  async update(id, data) {
    return (await axiosConfig.put(`${this.url}/${id}`, data)).data;
  }

  async delete(id) {
    return await axiosConfig.delete(`${this.url}/${id}`);
  }
}

export default new EventRoomService();
