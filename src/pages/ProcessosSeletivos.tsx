import { Layout } from "@/components/layout/Layout";
import { Briefcase } from "lucide-react";

const ProcessosSeletivos = () => {
  // Simulando que não há processos disponíveis
  const processos: any[] = [];

  return (
    <Layout>
      <div className="gov-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Processos Seletivos
          </h1>
          <p className="text-muted-foreground">
            Confira os processos seletivos com inscrições abertas
          </p>
        </div>

        {/* Content */}
        {processos.length === 0 ? (
          <div className="bg-card rounded-xl border p-16 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum processo seletivo disponível
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              No momento não há processos seletivos com inscrições abertas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Lista de processos iria aqui */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProcessosSeletivos;
