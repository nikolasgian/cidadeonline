import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Building2,
  Filter,
  Search,
  PieChart as PieChartIcon,
  Mail,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "@/hooks/use-toast";

// Mock data - Gestores podem ver apenas dados da sua secretaria
const mockProtocolosPorSecretaria = {
  "obras": [
    { numero: "ITJ-2025-00081", data: "11/01/2026", status: "em_atendimento", secretaria: "Obras", tipo: "Iluminação Pública", origem: "online", lido: true },
    { numero: "ITJ-2025-00075", data: "09/01/2026", status: "aberto", secretaria: "Obras", tipo: "Buracos e Vias", origem: "online", lido: false },
  ],
  "saude": [
    { numero: "ITJ-2025-00079", data: "10/01/2026", status: "concluido", secretaria: "Saúde", tipo: "Vacinação", origem: "presencial", lido: true },
  ],
  "ambiente": [
    { numero: "ITJ-2025-00083", data: "11/01/2026", status: "aberto", secretaria: "Meio Ambiente", tipo: "Denúncia Ambiental", origem: "online", lido: false },
  ],
};

// Dados por tipo para o gestor ver
const tiposPorSecretaria = {
  "obras": [
    { tipo: "Iluminação Pública", total: 1, abertos: 0, andamento: 1, concluidos: 0 },
    { tipo: "Buracos e Vias", total: 1, abertos: 1, andamento: 0, concluidos: 0 },
    { tipo: "Calçamento", total: 0, abertos: 0, andamento: 0, concluidos: 0 },
  ],
  "saude": [
    { tipo: "Vacinação", total: 1, abertos: 0, andamento: 0, concluidos: 1 },
    { tipo: "Saúde Preventiva", total: 0, abertos: 0, andamento: 0, concluidos: 0 },
  ],
  "ambiente": [
    { tipo: "Denúncia Ambiental", total: 1, abertos: 1, andamento: 0, concluidos: 0 },
    { tipo: "Poda de Árvores", total: 0, abertos: 0, andamento: 0, concluidos: 0 },
    { tipo: "Limpeza Urbana", total: 0, abertos: 0, andamento: 0, concluidos: 0 },
  ],
};

const statusData = [
  { name: "Aberto", value: 2, color: "#f59e0b" },
  { name: "Em Atendimento", value: 1, color: "#3b82f6" },
  { name: "Concluído", value: 0, color: "#22c55e" },
];

const tiposRelatorio = [
  { value: "geral", label: "Relatório Geral" },
  { value: "tipo", label: "Por Tipo de Serviço" },
  { value: "prioridade", label: "Por Prioridade" },
];

export default function GestaoRelatorios() {
  // Simulando que o gestor está da secretaria de Obras
  const secretariaGestor = "obras";
  const nomesSecretaria = {
    "obras": "Secretaria de Obras",
    "saude": "Secretaria de Saúde",
    "ambiente": "Secretaria de Meio Ambiente",
  };
  
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [leituraFilter, setLeituraFilter] = useState("todos");
  const [tipoRelatorio, setTipoRelatorio] = useState("geral");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const protocolosDaSecretaria = mockProtocolosPorSecretaria[secretariaGestor] || [];

  // Filtrar protocolos baseado em critérios
  const filteredProtocolos = protocolosDaSecretaria.filter((p) => {
    // Filtro de data
    if (dataInicio) {
      const dataProtocolo = new Date(p.data.split("/").reverse().join("-"));
      const dataFil = new Date(dataInicio);
      if (dataProtocolo < dataFil) return false;
    }
    if (dataFim) {
      const dataProtocolo = new Date(p.data.split("/").reverse().join("-"));
      const dataFil = new Date(dataFim);
      if (dataProtocolo > dataFil) return false;
    }
    
    // Filtro de status
    if (statusFilter !== "todos" && p.status !== statusFilter) return false;
    
    // Filtro de leitura
    if (leituraFilter === "lidos" && !p.lido) return false;
    if (leituraFilter === "nao_lidos" && p.lido) return false;
    
    return true;
  });

  const stats = {
    total: filteredProtocolos.length,
    abertos: filteredProtocolos.filter(p => p.status === "aberto").length,
    andamento: filteredProtocolos.filter(p => p.status === "em_atendimento").length,
    concluidos: filteredProtocolos.filter(p => p.status === "concluido").length,
  };

  const tiposDaSecretaria = Array.from(
    new Set(filteredProtocolos.map(p => p.tipo))
  ).map(tipo => ({
    tipo: tipo,
    total: filteredProtocolos.filter(p => p.tipo === tipo).length,
    abertos: filteredProtocolos.filter(p => p.tipo === tipo && p.status === "aberto").length,
    andamento: filteredProtocolos.filter(p => p.tipo === tipo && p.status === "em_atendimento").length,
    concluidos: filteredProtocolos.filter(p => p.tipo === tipo && p.status === "concluido").length,
  }));

  const statusDataFiltered = [
    { name: "Aberto", value: stats.abertos, color: "#f59e0b" },
    { name: "Em Atendimento", value: stats.andamento, color: "#3b82f6" },
    { name: "Concluído", value: stats.concluidos, color: "#22c55e" },
  ].filter(s => s.value > 0);

  const handleExport = () => {
    setIsExportDialogOpen(true);
  };

  const handleConfirmExport = (tipo: string) => {
    let mensagem = "";
    switch (tipo) {
      case "atual":
        mensagem = "Relatório atual da sua secretaria exportado com sucesso!";
        break;
      case "semanal":
        mensagem = "Relatório semanal da sua secretaria exportado com sucesso!";
        break;
      case "mensal":
        mensagem = "Relatório mensal da sua secretaria exportado com sucesso!";
        break;
      case "anual":
        mensagem = "Relatório anual da sua secretaria exportado com sucesso!";
        break;
      default:
        mensagem = "Relatório exportado com sucesso!";
    }
    
    toast({
      title: "Exportando",
      description: mensagem,
    });
    setIsExportDialogOpen(false);
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
              <h1 className="text-3xl font-bold text-foreground">📊 Relatórios de Gestão</h1>
              <p className="text-muted-foreground mt-1">
                {nomesSecretaria[secretariaGestor]} - Análise de protocolos
              </p>
            </div>
            <Button className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Leitura</Label>
                  <Select value={leituraFilter} onValueChange={setLeituraFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="lidos">Lidos</SelectItem>
                      <SelectItem value="nao_lidos">Não Lidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Relatório</Label>
                  <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposRelatorio.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </Card>
            <Card className="p-4">
              <p className="text-2xl font-bold text-amber-600">{stats.abertos}</p>
              <p className="text-xs text-muted-foreground">Abertos</p>
            </Card>
            <Card className="p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.andamento}</p>
              <p className="text-xs text-muted-foreground">Em Atendimento</p>
            </Card>
            <Card className="p-4">
              <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
              <p className="text-xs text-muted-foreground">Concluídos</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Por Tipo de Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={tiposDaSecretaria} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="tipo" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Por Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDataFiltered}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusDataFiltered.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Tipos */}
          {tipoRelatorio === "tipo" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Detalhamento por Tipo de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Serviço</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Abertos</TableHead>
                      <TableHead>Em Atendimento</TableHead>
                      <TableHead>Concluídos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tiposDaSecretaria.map((row) => (
                      <TableRow key={row.tipo}>
                        <TableCell className="font-medium">{row.tipo}</TableCell>
                        <TableCell>{row.total}</TableCell>
                        <TableCell>{row.abertos}</TableCell>
                        <TableCell>{row.andamento}</TableCell>
                        <TableCell>{row.concluidos}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Protocolos Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Protocolos ({filteredProtocolos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9 max-w-sm" />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Leitura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProtocolos.length > 0 ? (
                      filteredProtocolos.map((protocolo) => (
                        <TableRow key={protocolo.numero}>
                          <TableCell className="font-mono font-medium">
                            {protocolo.numero}
                          </TableCell>
                          <TableCell>{protocolo.data}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                protocolo.status === "concluido"
                                  ? "default"
                                  : protocolo.status === "aberto"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {protocolo.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{protocolo.tipo}</TableCell>
                          <TableCell>{protocolo.origem}</TableCell>
                          <TableCell>
                            <Badge variant={protocolo.lido ? "default" : "secondary"}>
                              {protocolo.lido ? "Lido" : "Não lido"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhum protocolo encontrado com os filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Export Dialog */}
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Exportar Relatório
                </DialogTitle>
                <DialogDescription>
                  Escolha qual relatório deseja exportar
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 my-6">
                <button
                  onClick={() => handleConfirmExport("atual")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                >
                  <p className="font-medium">Relatório Atual</p>
                  <p className="text-sm text-muted-foreground">Exporta os dados visíveis na tela</p>
                </button>
                
                <button
                  onClick={() => handleConfirmExport("semanal")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                >
                  <p className="font-medium">Relatório Semanal</p>
                  <p className="text-sm text-muted-foreground">Últimos 7 dias com status de leitura</p>
                </button>
                
                <button
                  onClick={() => handleConfirmExport("mensal")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                >
                  <p className="font-medium">Relatório Mensal</p>
                  <p className="text-sm text-muted-foreground">Últimos 30 dias com status de leitura</p>
                </button>
                
                <button
                  onClick={() => handleConfirmExport("anual")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                >
                  <p className="font-medium">Relatório Anual</p>
                  <p className="text-sm text-muted-foreground">Últimos 365 dias com status de leitura</p>
                </button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </Layout>
  );
}
