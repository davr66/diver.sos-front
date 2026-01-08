import ListItem from "../components/ListItem";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import groupImage from "../assets/group.svg";
import { useEffect, useState } from "react";
import { getSupportGroups } from "../services/api";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";

export default function SupportGroups(){
  const {isAuthenticated} = useAuth();
  const [groupList,setGroupList] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    if(isAuthenticated){
      const fetchGroups = async ()=>{
        try {
          const response = await getSupportGroups();
          console.log(response);
          setGroupList(response.data); 
        } catch (err) {
          console.error(err);
        } finally{
          setLoading(false);
        }
      }
      fetchGroups()
    }else{
      setLoading(false)
    }
  },[isAuthenticated])

  if(loading) return <Loading/>

  return(
    <div className="flex flex-col items-center">
    {isAuthenticated ? 
    ( <>
        <div className='flex flex-col gap-2 mt-2 mb-5 w-[90%]'>
          <SearchBar placeholder="Pesquisar grupos..."/>
        </div>
        {groupList.map((group,index)=>(<ListItem key={index} data={group}/>))}
      </>
    )
    :(
      <div className="flex flex-col items-center self-center gap-10 py-10 lg:scale-120 lg:justify-end">
        <img className="w-70"src={groupImage} alt="Ilustração de um grupo de pessoas" />
        <div className="flex flex-col items-center">
          <h1 className="font-[Nunito] font-bold text-2xl">Conexão, escuta e apoio</h1>
          <p className="max-w-60 font-medium text-sm text-center" >Entre com sua conta para acessar grupos de apoio inclusivos!</p>
        </div>
        <Link className="border-2 border-b-3 border-r-3 rounded-md bg-[var(--groups-bg)] px-4 py-3 uppercase text-sm font-bold hover:bg-[#d17b95]" to="/login">Ir para o login</Link>
      </div>
    )}
    </div>
  )
}