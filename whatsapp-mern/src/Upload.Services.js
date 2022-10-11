import axios from "axios";
import instance from "axios";

class UploadService {
  getImages() {
    return axios.get(` ${axios.instance}/download`);
  }

  sendImages(name, file) {
    const form = new FormData();
    form.append("name", name);
    form.append("file", file, "form-data");

    return axios.post("http://localhost:9000/upload", form);
  }
}

export default new UploadService();
