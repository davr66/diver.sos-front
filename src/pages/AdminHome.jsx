import AdminLink from "../components/AdminLink";
import { JobsIcon,GroupsIcon,NewsIcon,ManageUserIcon } from "../assets/nav";

export default function AdminHome(){
  return(
    <div className="flex flex-col items-center w-full">
      <h1 className="font-[Nunito] font-bold text-2xl mb-10">Ações disponíveis para seu perfil</h1>
      <div className="flex flex-wrap gap-5 items-evenly w-full">
        <AdminLink
        icon={JobsIcon}
        label={"Gerenciar Vagas"}
        description={"Crie e aprove novas vagas postadas na plataforma"}
        bgColor={"#FFE79D"}
        href={'/admin/vagas'}
        />
        <AdminLink
          icon={GroupsIcon}
          label={"Gerenciar Grupos"}
          description={"Crie e verifique novos grupos de apoio"}
          bgColor={"#FFA3BE"}
          href={'/admin/grupos'}
        />
        <AdminLink
          icon={NewsIcon}
          label={"Gerenciar Notícias"}
          description={"Crie novas notícias para o feed da plataforma"}
          bgColor={"#6782EE"}
          href={'/admin/noticias'}
        />
        <AdminLink
          icon={ManageUserIcon}
          label={"Gerenciar Usuários"}
          description={"Gerencie moderadores, perfis de rh e usuários comuns da plataforma"}
          bgColor={"#CCFFB4"}
          href={'/admin/gerenciar-usuarios'}
        />
      </div>
    </div>
  )
}