import axios from "axios";
const url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL:url? url : "http://localhost:8080"
});

api.interceptors.request.use(
  (config) =>{
    const token = sessionStorage.getItem("token");

    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }

    return config;
  },(error) => Promise.reject(error)
);

const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const transformJob = (job) => ({
  title: job.titulo,
  company: job.empresa,
  location: job.cidade,
  work_mode: toTitleCase(job.modalidade),
  description: job.descricao,
  status: job.status,
  type: job.tipo,
  id: job.id,
  createdAt: job.dataCriacao,
  deadline: job.dataLimite,
  jobLink: job.linkDaVaga
});

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login",loginData);
  return response;
}

export const getMyData = async ()=>{
  const response = await api.get("/usuarios/me");
  console.log(response);
  return response;
}

export const updateMyData = async (data) =>{
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

export const getAllUsers = async() =>{
  const response = await api.get('/usuarios');
  return response;
}      

export const getJobOpenings = async()=>{
  const response = await api.get("/vagas");
  const transformedData = response.data.map(transformJob);
  return { ...response, data: transformedData };
}

export const searchJobOpenings = async(params)=>{
  const response = await api.get("/vagas/buscar", {params});
  const transformedData = response.data.map(transformJob);
  return { ...response, data: transformedData };
}

export const getJobById = async(id)=>{
  const response = await api.get(`/vagas/${id}`);
  return{
    ...response,
    data: transformJob(response.data)
  };
}