# Sistema Cidade Conectada - Guia de Funcionalização e Deploy

## 📋 **O que Falta para o Sistema Ser Funcional**

### **1. Backend e Banco de Dados**
- ❌ **API REST/GraphQL** - Sistema usa apenas dados mockados
- ❌ **Banco de dados** - Não há persistência de dados
- ❌ **Autenticação** - Login/cadastro não funcionam
- ❌ **Autorização** - Controle de permissões inexistente

### **2. Funcionalidades Essenciais**
- ❌ **Envio de formulários** - Dados não são salvos
- ❌ **Upload de arquivos** - Documentos não são armazenados
- ❌ **Notificações em tempo real** - Sistema de notificações mockado
- ❌ **Relatórios dinâmicos** - Dados não são calculados em tempo real
- ❌ **Busca e filtros avançados** - Funciona apenas com dados mockados

### **3. Segurança e Performance**
- ❌ **Validação de dados** - Apenas validação frontend
- ❌ **Rate limiting** - Sem proteção contra abuso
- ❌ **Logs e monitoramento** - Sem rastreamento de erros
- ❌ **Backup e recuperação** - Dados não são persistidos

### **4. Configuração de Produção**
- ❌ **Variáveis de ambiente** - Configurações hardcoded
- ❌ **CI/CD** - Sem pipeline de deploy automatizado
- ❌ **Monitoramento** - Sem observabilidade
- ❌ **Cache** - Sem otimização de performance

---

## 🚀 **Plano para Tornar o Sistema Funcional**

### **Fase 1: Backend Básico (1-2 semanas)**

#### **1.1 Configurar Supabase**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar projeto
supabase init

# Criar projeto no Supabase Dashboard
# Configurar variáveis de ambiente
```

#### **1.2 Criar Tabelas no Banco**
```sql
-- Usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('cidadao', 'gestor', 'admin')),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Protocolos
CREATE TABLE protocolos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT CHECK (status IN ('aberto', 'em_atendimento', 'concluido', 'cancelado')),
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  usuario_id UUID REFERENCES usuarios(id),
  secretaria_id UUID,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- E mais tabelas conforme necessário...
```

#### **1.3 Configurar Autenticação**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### **Fase 2: Integração Frontend-Backend (1 semana)**

#### **2.1 Substituir Dados Mockados**
```typescript
// Antes (mock)
const mockProtocolos = [...]

// Depois (real)
const { data: protocolos, error } = await supabase
  .from('protocolos')
  .select('*')
  .eq('usuario_id', user.id)
```

#### **2.2 Implementar Autenticação**
```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### **Fase 3: Funcionalidades Avançadas (1-2 semanas)**

#### **3.1 Upload de Arquivos**
```typescript
// src/lib/upload.ts
export async function uploadFile(file: File, bucket: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error
  return data
}
```

#### **3.2 Notificações em Tempo Real**
```typescript
// src/hooks/useNotifications.ts
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useNotifications(userId: string) {
  useEffect(() => {
    const channel = supabase
      .channel('protocolos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'protocolos',
        filter: `usuario_id=eq.${userId}`
      }, (payload) => {
        console.log('Mudança detectada:', payload)
        // Atualizar notificações
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])
}
```

---

## 🌐 **Deploy no Vercel + Supabase**

### **Passo 1: Preparar o Projeto**

#### **1.1 Criar arquivo .env.local**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

#### **1.2 Configurar Vite para Produção**
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  // ... configuração existente
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    }
  }
}))
```

#### **1.3 Criar arquivo vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Passo 2: Configurar Supabase**

#### **2.1 Criar Projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Anote a URL e chaves do projeto

#### **2.2 Configurar Autenticação**
```sql
-- No SQL Editor do Supabase
ALTER TABLE auth.users ADD COLUMN tipo TEXT DEFAULT 'cidadao';
```

#### **2.3 Configurar Storage (opcional)**
```sql
-- Criar bucket para uploads
INSERT INTO storage.buckets (id, name) VALUES ('protocolos', 'protocolos');
```

### **Passo 3: Deploy no Vercel**

#### **3.1 Conectar Repositório**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Inicializar projeto
vercel

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### **3.2 Deploy**
```bash
# Deploy de produção
vercel --prod
```

### **Passo 4: Configurar Domínio (Opcional)**

#### **4.1 No Vercel Dashboard**
1. Vá para Settings > Domains
2. Adicione seu domínio personalizado
3. Configure os registros DNS

#### **4.2 No Supabase (se necessário)**
1. Vá para Settings > API
2. Adicione o domínio nas "Allowed URLs"

---

## 📊 **Custos Estimados**

### **Supabase (Free Tier)**
- ✅ 500MB Database
- ✅ 50MB File Storage
- ✅ 50,000 monthly active users
- ✅ 500 hours of compute time

### **Vercel (Free Tier)**
- ✅ 100GB bandwidth/month
- ✅ 100GB hours/month
- ✅ Custom domains
- ✅ SSL automático

### **Upgrade quando necessário:**
- **Supabase Pro:** ~$25/mês (2GB DB, 100GB Storage)
- **Vercel Pro:** ~$20/mês (1TB bandwidth, 1000GB hours)

---

## 🎯 **Próximos Passos Imediatos**

### **Dia 1-2: Configuração Básica**
1. Criar conta no Supabase
2. Configurar projeto e banco
3. Criar tabelas essenciais
4. Configurar variáveis de ambiente

### **Dia 3-5: Autenticação**
1. Implementar login/cadastro
2. Configurar middleware de autenticação
3. Proteger rotas

### **Dia 6-8: CRUD Básico**
1. Conectar protocolos ao banco
2. Implementar criação/edição
3. Substituir dados mockados

### **Dia 9-10: Deploy**
1. Configurar Vercel
2. Fazer deploy inicial
3. Testar funcionalidades

### **Dia 11-14: Funcionalidades Avançadas**
1. Upload de arquivos
2. Notificações em tempo real
3. Relatórios dinâmicos

---

## 🔧 **Scripts Úteis para Desenvolvimento**

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "type-check": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "deploy": "vercel --prod"
  }
}
```

---

## 🚨 **Considerações Importantes**

1. **Backup:** Configure backups automáticos no Supabase
2. **Monitoramento:** Use Vercel Analytics e Supabase logs
3. **Segurança:** Implemente validações server-side
4. **Performance:** Configure CDN e cache apropriadamente
5. **Escalabilidade:** Planeje para crescimento futuro

O sistema está bem estruturado no frontend. O maior trabalho será implementar o backend e conectar tudo ao Supabase. Com 2-3 semanas de desenvolvimento focado, você terá um sistema totalmente funcional!