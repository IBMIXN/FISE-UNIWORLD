import { axiosConfig } from "../config";

class LectureRoomService {
  url = "/lecturerooms";

  async get() {
    return (await axiosConfig.get(this.url)).data;
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

export default new LectureRoomService();
