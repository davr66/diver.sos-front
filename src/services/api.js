import axios from "axios";
const url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: url ? url : "http://localhost:8080"
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = sessionStorage.getItem("token");
      console.debug("API request:", config.method?.toUpperCase(), config.url, "tokenPresent=", !!token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.debug("API request: Authorization header attached");
      }
    } catch (e) {
      console.debug("API interceptor error reading token", e);
    }

    return config;
  }, (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.debug("API response error:", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const transformJob = (job) => ({
  title: job.titulo,
  company: job.empresa,
  city: job.cidade,
  work_mode: toTitleCase(job.modalidade),
  description: job.descricao,
  status: job.status,
  type: job.tipo,
  uf: job.estado,
  id: job.id,
  createdAt: job.dataCriacao,
  deadline: job.dataLimite,
  jobLink: job.linkDaVaga,
  bannerDaVaga: job.bannerDaVaga,
  skills: Array.isArray(job.habilidades) ? job.habilidades : []
});

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response;
}

export const confirmAccount = async (token) => {
  const response = await api.get("/auth/confirmar", { params: { token } });
  return response;
}

export const setNewPassword = async (token, novaSenha, novaSenhaRepeticao) => {
  const response = await api.post(
    "/auth/nova-senha",
    { novaSenha, novaSenhaRepeticao },
    { params: { token } }
  );
  return response;
}

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/esqueci-senha', { email: String(email ?? '').trim() });
  return response;
}

export const registerUser = async (userData) => {
  const response = await api.post('/usuarios', userData);
  return response;
}

export const getMyData = async () => {
  const response = await api.get("/usuarios/me");
  console.log(response);
  return response;
}

export const updateMyData = async (data) => {
  const response = await api.put("/usuarios/me", data);
  return response;
}

export const getUserById = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response;
}

export const updateUserById = async (id, data) => {
  const response = await api.put(`/usuarios/${id}`, data);
  return response;
}

export const getAllUsers = async () => {
  const response = await api.get('/usuarios');
  return response;
}

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('arquivo', file);
  const response = await api.post('/usuarios/me/foto', formData);
  return response;
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response;
}

export const getMyFavoriteJobs = async () => {
  const response = await api.get("/usuarios/me/vagas");
  const transformedData = Array.isArray(response.data) ? response.data.map(transformJob) : [];
  return { ...response, data: transformedData };
}
export const saveJobOpening = async (id) => {
  const response = await api.post(`/usuarios/me/vagas/${id}`);
  return response;
}

export const deleteSavedJobOpening = async (id) =>{
  const response = await api.delete(`/usuarios/me/vagas/${id}`);
  return response;
}

export const deleteJobOpening = async(id)=>{
  const response = await api.delete(`/vagas/${id}`);
  return response;
}

export const saveGroup = async (id) => {
  const response = await api.post(`/usuarios/me/grupos/${id}`);
  return response;
}

export const deleteSavedGroup = async (id) =>{
  const response = await api.delete(`/usuarios/me/grupos/${id}`);
  return response;
}

export const getMyGroups = async () => {
  const response = await api.get('/usuarios/me/grupos');
  return response;
}

export const getNews = async () =>{
  const response = await api.get('/noticias');
  return response;
}

export const getNewsById = async (id) => {
  const response = await api.get(`/noticias/${id}`);
  return response;
}
export const createNews = async (data) => {
  const response = await api.post('/noticias', data);
  return response;
}

export const editNews = async (id, data) => {
  const response = await api.put(`/noticias/${id}`, data);
  return response;
}

export const appendNewsPhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('foto', file);
  const response = await api.post(`/noticias/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export const deleteNews = async (id) => {
  const response = await api.delete(`/noticias/${id}`);
  return response;
}

export const getJobOpenings = async () => {
  const response = await api.get("/vagas/ativas");
  const transformedData = response.data.map(transformJob);
  return { ...response, data: transformedData };
}

export const getAllJobOpenings = async () => {
  const response = await api.get("/vagas");
  const transformedData = response.data.map(transformJob);
  return { ...response, data: transformedData };
}

export const createJobOpening = async (data) =>{
  const response = await api.post("/vagas",data);
  return response;
}

export const appendJobBanner = async(id, file) =>{
  const formData = new FormData();
  formData.append('arquivo', file);
  const response = await api.post(`/vagas/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export const editJobOpening = async (id,data)=>{
  const response = await api.put(`/vagas/${id}`,data);
  return response;
}

export const searchJobOpenings = async (params) => {
  const response = await api.get("/vagas/buscar", { params });
  const transformedData = response.data.map(transformJob);
  return { ...response, data: transformedData };
}

export const getJobById = async (id) => {
  const response = await api.get(`/vagas/${id}`);
  return {
    ...response,
    data: transformJob(response.data)
  };
}

export const getSupportGroups = async () => {
  const response = await api.get('/grupos');
  return response;
}

export const getGroupById = async (id) => {
  const response = await api.get(`/grupos/${id}`);
  return response;
}

export const createGroup = async (data) => {
  const response = await api.post('/grupos', data);
  return response;
}

export const appendGroupBanner = async (id, file) =>{
  const formData = new FormData();
  formData.append('arquivo', file);
  const response = await api.post(`/grupos/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export const editGroup = async (id, data) => {
  const response = await api.put(`/grupos/${id}`, data);
  return response;
}

export const deleteGroup = async (id) => {
  const response = await api.delete(`/grupos/${id}`);
  return response;
}

export const getSkills = async () =>{
  const response = await api.get('/habilidades');
  return response;
}

export const createSkill = async (nome) => {
  const response = await api.post('/habilidades', { nome });
  return response;
}
