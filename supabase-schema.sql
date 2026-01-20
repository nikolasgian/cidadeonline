-- Sistema Cidade Conectada - Schema Inicial
-- Execute estes comandos no SQL Editor do Supabase

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários (perfis adicionais)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('cidadao', 'gestor', 'admin')) DEFAULT 'cidadao',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Secretarias
CREATE TABLE IF NOT EXISTS public.secretarias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  responsavel TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Tipos de Protocolo
CREATE TABLE IF NOT EXISTS public.tipos_protocolo (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  secretaria_id UUID REFERENCES public.secretarias(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Protocolos
CREATE TABLE IF NOT EXISTS public.protocolos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT CHECK (status IN ('aberto', 'em_atendimento', 'concluido', 'cancelado')) DEFAULT 'aberto',
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  secretaria_id UUID REFERENCES public.secretarias(id),
  tipo_protocolo_id UUID REFERENCES public.tipos_protocolo(id),
  atendente_id UUID REFERENCES public.usuarios(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prazo_resolucao TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE
);

-- Tabela de Anexos
CREATE TABLE IF NOT EXISTS public.anexos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo_id TEXT REFERENCES public.protocolos(id) ON DELETE CASCADE,
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT,
  tamanho_bytes INTEGER,
  usuario_id UUID REFERENCES public.usuarios(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Comentários/Histórico
CREATE TABLE IF NOT EXISTS public.comentarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo_id TEXT REFERENCES public.protocolos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.usuarios(id),
  comentario TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('comentario', 'status_change', 'assignment')) DEFAULT 'comentario',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para protocolos
CREATE POLICY "Usuários podem ver seus próprios protocolos" ON public.protocolos
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Gestores podem ver protocolos de sua secretaria" ON public.protocolos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND tipo IN ('gestor', 'admin')
    )
  );

CREATE POLICY "Usuários podem criar protocolos" ON public.protocolos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Gestores podem atualizar protocolos" ON public.protocolos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND tipo IN ('gestor', 'admin')
    )
  );

-- Políticas para anexos
CREATE POLICY "Usuários podem ver anexos de seus protocolos" ON public.anexos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.protocolos
      WHERE id = protocolo_id AND usuario_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND tipo IN ('gestor', 'admin')
    )
  );

-- Políticas para comentários
CREATE POLICY "Usuários podem ver comentários de seus protocolos" ON public.comentarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.protocolos
      WHERE id = protocolo_id AND usuario_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND tipo IN ('gestor', 'admin')
    )
  );

-- Função para gerar ID de protocolo
CREATE OR REPLACE FUNCTION generate_protocol_id()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_number INTEGER;
  new_id TEXT;
BEGIN
  year := EXTRACT(YEAR FROM NOW())::TEXT;
  SELECT COALESCE(MAX(CAST(SPLIT_PART(id, '-', 3) AS INTEGER)), 0) + 1
  INTO sequence_number
  FROM public.protocolos
  WHERE SPLIT_PART(id, '-', 2) = year;

  new_id := '113-' || year || '-' || LPAD(sequence_number::TEXT, 6, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar data de modificação
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_protocolos_updated_at
  BEFORE UPDATE ON public.protocolos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dados iniciais
INSERT INTO public.secretarias (nome, descricao, responsavel) VALUES
  ('Secretaria de Infraestrutura', 'Responsável por obras e manutenção urbana', 'João Silva'),
  ('Secretaria de Meio Ambiente', 'Gestão ambiental e sustentabilidade', 'Maria Santos'),
  ('Secretaria de Saúde', 'Serviços de saúde pública', 'Dr. Carlos Oliveira'),
  ('Secretaria de Educação', 'Educação e cultura', 'Prof. Ana Costa'),
  ('Secretaria de Segurança', 'Segurança pública', 'Ten. Roberto Lima');

-- Tipos de protocolo iniciais
INSERT INTO public.tipos_protocolo (nome, descricao, prioridade, secretaria_id) VALUES
  ('Buraco na via', 'Denúncia de buraco em ruas e avenidas', 'media',
   (SELECT id FROM public.secretarias WHERE nome = 'Secretaria de Infraestrutura')),
  ('Iluminação pública', 'Problemas com postes e iluminação', 'media',
   (SELECT id FROM public.secretarias WHERE nome = 'Secretaria de Infraestrutura')),
  ('Construção irregular', 'Denúncia de construções irregulares', 'alta',
   (SELECT id FROM public.secretarias WHERE nome = 'Secretaria de Meio Ambiente')),
  ('Árvore caída', 'Árvores caídas ou poda necessária', 'media',
   (SELECT id FROM public.secretarias WHERE nome = 'Secretaria de Meio Ambiente')),
  ('Dengue', 'Foco de dengue ou limpeza necessária', 'alta',
   (SELECT id FROM public.secretarias WHERE nome = 'Secretaria de Saúde'));