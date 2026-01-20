import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ConsultaProtocolo from "./pages/ConsultaProtocolo";
import PainelSenhas from "./pages/PainelSenhas";
import MeusProtocolos from "./pages/MeusProtocolos";
import NovoProtocolo from "./pages/NovoProtocolo";
import Noticias from "./pages/Noticias";
import ProcessosSeletivos from "./pages/ProcessosSeletivos";
import DashboardGestor from "./pages/DashboardGestor";
import GestaoDashboard from "./pages/GestaoDashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import Secretarias from "./pages/Secretarias";
import GestaoNoticias from "./pages/GestaoNoticias";
import Relatorios from "./pages/Relatorios";
import GestaoRelatorios from "./pages/GestaoRelatorios";
import Configuracoes from "./pages/Configuracoes";
import Atendimentos from "./pages/Atendimentos";
import Recepcao from "./pages/Recepcao";
import Comunicacao from "./pages/Comunicacao";
import Notificacoes from "./pages/Notificacoes";
import AlterarSenha from "./pages/AlterarSenha";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/consulta-protocolo" element={<ConsultaProtocolo />} />
          <Route path="/painel-senhas" element={<PainelSenhas />} />
          <Route path="/meus-protocolos" element={<MeusProtocolos />} />
          <Route path="/novo-protocolo" element={<NovoProtocolo />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/processos-seletivos" element={<ProcessosSeletivos />} />
          <Route path="/dashboard-gestor" element={<DashboardGestor />} />
          <Route path="/gestao-dashboard" element={<GestaoDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/gestao-usuarios" element={<GestaoUsuarios />} />
          <Route path="/secretarias" element={<Secretarias />} />
          <Route path="/gestao-noticias" element={<GestaoNoticias />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/gestao-relatorios" element={<GestaoRelatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/atendimentos" element={<Atendimentos />} />
          <Route path="/recepcao" element={<Recepcao />} />
          <Route path="/comunicacao/:id" element={<Comunicacao />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/alterar-senha" element={<AlterarSenha />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
