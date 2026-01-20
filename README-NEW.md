# Cidade Conectada - Sistema de Protocolo Digital

Sistema web para gestão de protocolos e atendimentos municipais, desenvolvido com React, TypeScript, Vite, Tailwind CSS e Supabase.

## 🚀 **Status do Projeto**

- ✅ **Frontend Completo** - Interface responsiva e moderna
- ✅ **Componentes UI** - Design system com shadcn/ui
- ✅ **Estrutura Base** - Páginas e navegação implementadas
- ❌ **Backend** - Apenas dados mockados (precisa implementar)
- ❌ **Autenticação** - Interface pronta, backend pendente
- ❌ **Banco de Dados** - Schema SQL criado, precisa configurar

## 📋 **O que Está Pronto**

### **Interface do Usuário**
- Dashboard para gestores e cidadãos
- Sistema de protocolos completo
- Gestão de usuários e secretarias
- Relatórios e estatísticas
- Notificações e comunicação
- Design responsivo e acessível

### **Arquitetura Técnica**
- React 18 com TypeScript
- Vite para build e desenvolvimento
- Tailwind CSS para estilização
- shadcn/ui para componentes
- React Router para navegação
- Framer Motion para animações

## 🔧 **Como Começar o Desenvolvimento**

### **1. Configuração Inicial**
```bash
# Clonar repositório
git clone <seu-repositorio>
cd cidade-conectada

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
```

### **2. Configurar Supabase**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Criar projeto no Supabase Dashboard
# https://supabase.com

# Configurar variáveis no .env.local
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### **3. Executar Schema do Banco**
```bash
# No SQL Editor do Supabase, execute o conteúdo de:
# supabase-schema.sql
```

### **4. Desenvolvimento Local**
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm run test

# Verificar tipos
npm run type-check

# Lint do código
npm run lint
```

## 🌐 **Deploy**

### **Vercel + Supabase**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login e configuração
vercel login
vercel

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy
npm run deploy
```

## 📁 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Layout e navegação
│   └── ui/            # Componentes base (shadcn/ui)
├── pages/             # Páginas da aplicação
├── hooks/             # Hooks customizados
├── lib/               # Utilitários e configurações
└── types/             # Definições TypeScript
```

## 🎯 **Próximos Passos para Funcionalização**

1. **Semana 1**: Configurar Supabase e implementar autenticação
2. **Semana 2**: Conectar CRUD de protocolos ao banco
3. **Semana 3**: Implementar upload de arquivos e notificações
4. **Semana 4**: Testes finais e deploy em produção

## 📖 **Documentação Detalhada**

Para instruções completas de implementação e deploy, consulte:
- [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) - Guia completo de deploy
- [supabase-schema.sql](./supabase-schema.sql) - Schema do banco de dados

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.