import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Printer,
  Users,
  Clock,
  Volume2,
  ChevronRight,
  RefreshCw,
  Plus,
  Settings,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const tiposAtendimento = [
  { id: "protocolo", label: "Protocolo", prefixo: "P", cor: "bg-blue-500" },
  { id: "certidao", label: "Certidão", prefixo: "C", cor: "bg-green-500" },
  { id: "alvara", label: "Alvará", prefixo: "A", cor: "bg-purple-500" },
  { id: "iptu", label: "IPTU", prefixo: "I", cor: "bg-amber-500" },
  { id: "outros", label: "Outros", prefixo: "O", cor: "bg-gray-500" },
];

const mockSenhas = [
  { numero: "P001", tipo: "protocolo", status: "aguardando", guiche: null, horario: "08:15" },
  { numero: "C002", tipo: "certidao", status: "em_atendimento", guiche: 1, horario: "08:20" },
  { numero: "P003", tipo: "protocolo", status: "aguardando", guiche: null, horario: "08:25" },
  { numero: "I004", tipo: "iptu", status: "aguardando", guiche: null, horario: "08:30" },
];

const mockGuiches = [
  { id: 1, atendente: "Maria Santos", status: "ocupado", senhaAtual: "C002" },
  { id: 2, atendente: "João Silva", status: "livre", senhaAtual: null },
  { id: 3, atendente: "Ana Costa", status: "livre", senhaAtual: null },
];

export default function Recepcao() {
  const [senhas, setSenhas] = useState(mockSenhas);
  const [guiches, setGuiches] = useState(mockGuiches);
  const [novaSenhaDialogOpen, setNovaSenhaDialogOpen] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [nomeCidadao, setNomeCidadao] = useState("");
  const [cpfCidadao, setCpfCidadao] = useState("");

  const stats = {
    aguardando: senhas.filter((s) => s.status === "aguardando").length,
    emAtendimento: senhas.filter((s) => s.status === "em_atendimento").length,
    atendidos: 15,
    tempoMedio: "12 min",
  };

  const handleGerarSenha = () => {
    const tipo = tiposAtendimento.find((t) => t.id === tipoSelecionado);
    if (!tipo) return;

    const novoNumero = `${tipo.prefixo}${String(senhas.length + 1).padStart(3, "0")}`;
    
    toast({
      title: `Senha ${novoNumero} gerada!`,
      description: "A senha está sendo impressa.",
    });

    // Simular impressão
    handlePrintSenha(novoNumero, tipo.label);

    setNovaSenhaDialogOpen(false);
    setTipoSelecionado("");
    setNomeCidadao("");
    setCpfCidadao("");
  };

  const handlePrintSenha = (numero: string, tipo: string) => {
    const printContent = `
      <html>
        <head>
          <title>Senha de Atendimento</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .numero { font-size: 72px; font-weight: bold; margin: 20px 0; }
            .tipo { font-size: 24px; color: #666; }
            .data { font-size: 14px; color: #999; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Prefeitura Municipal</h2>
          <p class="tipo">${tipo}</p>
          <p class="numero">${numero}</p>
          <p class="data">${new Date().toLocaleString("pt-BR")}</p>
          <p>Aguarde ser chamado</p>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleChamarProxima = (guicheId: number) => {
    const proximaSenha = senhas.find((s) => s.status === "aguardando");
    if (!proximaSenha) {
      toast({
        title: "Nenhuma senha na fila",
        description: "Não há cidadãos aguardando atendimento.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Chamando ${proximaSenha.numero}`,
      description: `Guichê ${guicheId}`,
    });

    // Atualizar estados
    setSenhas((prev) =>
      prev.map((s) =>
        s.numero === proximaSenha.numero
          ? { ...s, status: "em_atendimento", guiche: guicheId }
          : s
      )
    );
    setGuiches((prev) =>
      prev.map((g) =>
        g.id === guicheId
          ? { ...g, status: "ocupado", senhaAtual: proximaSenha.numero }
          : g
      )
    );
  };

  const handleFinalizarAtendimento = (guicheId: number) => {
    const guiche = guiches.find((g) => g.id === guicheId);
    if (!guiche?.senhaAtual) return;

    toast({
      title: "Atendimento finalizado",
      description: `Senha ${guiche.senhaAtual} foi atendida.`,
    });

    setSenhas((prev) =>
      prev.map((s) =>
        s.numero === guiche.senhaAtual ? { ...s, status: "atendido" } : s
      )
    );
    setGuiches((prev) =>
      prev.map((g) =>
        g.id === guicheId ? { ...g, status: "livre", senhaAtual: null } : g
      )
    );
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">🎫 Recepção</h1>
              <p className="text-muted-foreground mt-1">
                Gerenciamento de senhas e atendimento presencial
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button className="gap-2" onClick={() => setNovaSenhaDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nova Senha
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.aguardando}</p>
                  <p className="text-xs text-muted-foreground">Aguardando</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.emAtendimento}</p>
                  <p className="text-xs text-muted-foreground">Em Atendimento</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.atendidos}</p>
                  <p className="text-xs text-muted-foreground">Atendidos Hoje</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.tempoMedio}</p>
                  <p className="text-xs text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fila de Espera */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Fila de Espera
                  </span>
                  <Badge>{stats.aguardando}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {senhas
                  .filter((s) => s.status === "aguardando")
                  .map((senha, index) => {
                    const tipo = tiposAtendimento.find((t) => t.id === senha.tipo);
                    return (
                      <div
                        key={senha.numero}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          index === 0 ? "bg-amber-50 border-amber-200" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg ${tipo?.cor} flex items-center justify-center text-white font-bold`}
                          >
                            {senha.numero.charAt(0)}
                          </div>
                          <div>
                            <p className="font-mono font-bold">{senha.numero}</p>
                            <p className="text-xs text-muted-foreground">
                              {senha.horario}
                            </p>
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-amber-500">Próximo</Badge>
                        )}
                      </div>
                    );
                  })}

                {senhas.filter((s) => s.status === "aguardando").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum cidadão aguardando
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guichês */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Guichês de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guiches.map((guiche) => (
                    <Card
                      key={guiche.id}
                      className={`p-4 ${
                        guiche.status === "ocupado"
                          ? "border-blue-300 bg-blue-50"
                          : "border-green-300 bg-green-50"
                      }`}
                    >
                      <div className="text-center mb-4">
                        <p className="text-3xl font-bold text-foreground">
                          Guichê {guiche.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {guiche.atendente}
                        </p>
                      </div>

                      {guiche.senhaAtual ? (
                        <div className="text-center mb-4">
                          <Badge className="text-lg px-4 py-2">
                            {guiche.senhaAtual}
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-center mb-4">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            Livre
                          </Badge>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {guiche.status === "livre" ? (
                          <Button
                            className="w-full gap-1"
                            onClick={() => handleChamarProxima(guiche.id)}
                          >
                            <Volume2 className="h-4 w-4" />
                            Chamar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full gap-1"
                            onClick={() => handleFinalizarAtendimento(guiche.id)}
                          >
                            <ChevronRight className="h-4 w-4" />
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {tiposAtendimento.map((tipo) => (
              <Button
                key={tipo.id}
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => {
                  setTipoSelecionado(tipo.id);
                  setNovaSenhaDialogOpen(true);
                }}
              >
                <div className={`h-8 w-8 rounded-lg ${tipo.cor} flex items-center justify-center text-white font-bold`}>
                  {tipo.prefixo}
                </div>
                <span>{tipo.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Nova Senha Dialog */}
      <Dialog open={novaSenhaDialogOpen} onOpenChange={setNovaSenhaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Senha</DialogTitle>
            <DialogDescription>
              Gere uma senha de atendimento para o cidadão
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Atendimento *</Label>
              <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAtendimento.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      <span className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded ${tipo.cor}`}></span>
                        {tipo.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha-nome">Nome do Cidadão (opcional)</Label>
              <Input
                id="senha-nome"
                value={nomeCidadao}
                onChange={(e) => setNomeCidadao(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha-cpf">CPF (opcional)</Label>
              <Input
                id="senha-cpf"
                value={cpfCidadao}
                onChange={(e) => setCpfCidadao(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovaSenhaDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGerarSenha} disabled={!tipoSelecionado} className="gap-2">
              <Printer className="h-4 w-4" />
              Gerar e Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
