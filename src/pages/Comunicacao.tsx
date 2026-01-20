import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  User,
  Building2,
  Clock,
  CheckCircle,
  Paperclip,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data for messages
const mockMessages = [
  {
    id: "1",
    sender: "João Silva",
    senderType: "cidadao",
    message: "Olá, gostaria de saber sobre o andamento do meu protocolo sobre iluminação pública na Rua das Flores.",
    timestamp: "2025-01-15T14:35:00",
    read: true,
  },
  {
    id: "2",
    sender: "Maria Santos",
    senderType: "secretaria",
    message: "Olá João! Recebemos sua solicitação. Nossa equipe já foi designada para verificar o poste na Rua das Flores. Prevemos uma resposta em até 48 horas.",
    timestamp: "2025-01-15T15:00:00",
    read: true,
  },
  {
    id: "3",
    sender: "João Silva",
    senderType: "cidadao",
    message: "Obrigado pela resposta rápida! Há alguma atualização sobre quando o reparo será feito?",
    timestamp: "2025-01-16T09:30:00",
    read: true,
  },
  {
    id: "4",
    sender: "Carlos Oliveira",
    senderType: "secretaria",
    message: "Bom dia João. Após inspeção, identificamos que o poste precisa ser substituído. O material já foi solicitado e esperamos concluir o serviço em até 5 dias úteis.",
    timestamp: "2025-01-16T11:15:00",
    read: false,
  },
];

const mockProtocolo = {
  id: "1",
  numero: "ITJ-2025-00123",
  tipo_servico: "Iluminação Pública",
  secretaria: "Obras",
  status: "em_atendimento",
  descricao: "Poste apagado na esquina da Rua das Flores",
  created_date: "2025-01-15T14:30:00",
};

export default function Comunicacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Verificar se é comunicação com cidadão ou secretaria
  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get('tipo') || 'secretaria'; // 'cidadao' ou 'secretaria'

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    // Mock: simulate sending message
    setTimeout(() => {
      console.log("Mensagem enviada:", newMessage);
      setNewMessage("");
      setIsSending(false);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                💬 {tipo === 'cidadao' ? 'Comunicação com Solicitante' : 'Comunicação do Protocolo'}
              </h1>
              <p className="text-muted-foreground">
                Protocolo {mockProtocolo.numero}
              </p>
            </div>
          </div>

          {/* Protocol Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Informações do Protocolo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-semibold">{mockProtocolo.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
                  <p className="font-semibold">{mockProtocolo.tipo_servico}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Secretaria</p>
                  <p className="font-semibold">{mockProtocolo.secretaria}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="gov-badge-progress">
                    <Clock className="h-3 w-3 mr-1" />
                    Em Atendimento
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="text-sm">{mockProtocolo.descricao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.senderType === "cidadao" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.senderType === "secretaria" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderType === "cidadao"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.senderType === "cidadao" ? (
                            <>
                              <User className="h-3 w-3 inline mr-1" />
                              Você
                            </>
                          ) : (
                            <>
                              <Building2 className="h-3 w-3 inline mr-1" />
                              {message.sender}
                            </>
                          )}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.read && message.senderType === "secretaria" && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    {message.senderType === "cidadao" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Send Message */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enviar Mensagem {tipo === 'cidadao' ? 'para o Solicitante' : 'para a Secretaria'}
                  </label>
                  <Textarea
                    placeholder={`Digite sua mensagem ${tipo === 'cidadao' ? 'para o solicitante' : 'para a secretaria responsável'}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Paperclip className="h-4 w-4" />
                    Anexar Arquivo
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}