import axios from "axios";
const url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: url ? url : "http://localhost:8080"
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = sessionStorage.getItem("token");
      // log minimal debug info (do NOT log full token in production)
      console.debug("API request:", config.method?.toUpperCase(), config.url, "tokenPresent=", !!token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // also log that header was attached
        console.debug("API request: Authorization header attached");
      }
    } catch (e) {
      console.debug("API interceptor error reading token", e);
    }

    return config;
  }, (error) => Promise.reject(error)
);

// Response error logger for debugging 403 and other errors
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
  jobLink: job.linkDaVaga
});

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
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

export const getMyFavoriteJobs = async () => {
  const response = await api.get("/usuarios/me/vagas");
  const transformedData = Array.isArray(response.data) ? response.data.map(transformJob) : [];
  return { ...response, data: transformedData };
}

export const updateMyData = async (data) => {
  const response = await api.put("/usuarios/me", data);
  return response;
}

export const saveJobOpening = async (id) => {
  const response = await api.post(`/usuarios/me/vagas/${id}`);
  return response;
}

export const deleteSavedJobOpening = async (id) =>{
  const response = await api.delete(`/usuarios/me/vagas/${id}`);
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

export const getJobOpenings = async () => {
  const response = await api.get("/vagas");
  const transformedData = response.data.map(transformJob);
  return { ...response, data: transformedData };
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