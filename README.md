# Gaby Nails - versão Vercel + Supabase

Este projeto foi preparado para:
- rodar na **Vercel**
- usar **Supabase** no lugar do Base44
- ter **admin com senha** e cookie seguro
- permitir **upload de imagens estável** no painel
- salvar textos/imagens sem voltar dados antigos
- funcionar com disponibilidade de agenda sem expor dados dos clientes
- ler e gravar conteúdo via **API da Vercel**, evitando depender de leitura pública frágil no navegador

## Login do admin
Senha padrão do admin:

```txt
000000000
```

Você pode trocar depois em:

```txt
ADMIN_PASSWORD
VITE_ADMIN_PASSWORD
```

## Pode usar o mesmo projeto do Supabase?
Sim. Você pode usar o mesmo projeto Supabase de outro sistema **sem conflito**, desde que use as tabelas com prefixo `gabynails_` e o bucket `gabynails-assets` criados por este projeto.

## 1) Configurar o banco no Supabase
No painel do Supabase, abra o SQL Editor e rode o arquivo:

```txt
supabase/schema.sql
```

Esse arquivo agora é **seguro para reexecutar** e inclui:
- tabelas exclusivas do site com prefixo `gabynails_`
- bucket `gabynails-assets`
- proteção para manter **apenas 1 registro** em `gabynails_site_settings`
- índices para evitar conflito de horários no agendamento

Se você já tinha rodado uma versão anterior do schema, rode novamente para aplicar os ajustes.

## 2) Variáveis de ambiente
Copie `.env.example` para `.env.local`.

Hoje, o projeto depende principalmente destas variáveis no backend da Vercel:

```env
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=COLE_SUA_SERVICE_ROLE_KEY
ADMIN_PASSWORD=asd123
SUPABASE_STORAGE_BUCKET=gabynails-assets
```

### Variáveis opcionais
```env
VITE_ADMIN_PASSWORD=asd123
VITE_LOCAL_API_ORIGIN=http://localhost:3000
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave_publica
```

### Importante
Sem a **service role key**, o admin não consegue editar/excluir/upload com segurança e o site não consegue buscar os dados pela API da Vercel.

## 3) Rodar localmente
### Front público
```bash
npm install
npm run dev
```

Abra:

```txt
http://localhost:5173
```

### Admin/API local
As rotas em `/api` são da Vercel. Para testar o admin e o site localmente com persistência real, rode a API com a Vercel CLI e aponte o Vite para ela:

```bash
VITE_LOCAL_API_ORIGIN=http://localhost:3000 npm run dev
```

A ideia é usar o front na porta 5173 e as APIs da Vercel na porta 3000.

## 4) Build local
```bash
npm run build
npm run preview
```

## 5) Subir no GitHub e Vercel
1. envie o projeto para um repositório no GitHub
2. importe esse repositório na Vercel
3. configure as mesmas variáveis de ambiente da `.env.local`
4. faça o deploy

## Estrutura da autenticação do admin
- o front mostra tela de senha em `/admin`
- a verificação é feita por **API Route da Vercel**
- as operações sensíveis do admin usam **SUPABASE_SERVICE_ROLE_KEY** no backend da Vercel
- uploads do admin passam pelo backend e não expõem a service role no navegador

## Ajustes aplicados nesta revisão
- proteção real do admin
- logout funcional
- upload de imagem refeito com parser robusto
- botão de upload não trava mais se houver erro
- reenvio do mesmo arquivo funciona
- leituras públicas e do admin passaram a vir da **API da Vercel**, não mais diretamente do navegador
- cadastro de agendamento e lead do curso também passam pela **API pública da Vercel**
- disponibilidade da agenda agora vem por API protegida
- `gabynails_site_settings` agora usa **saveSingleton**, limpando duplicatas e mantendo 1 registro válido
- respostas da API usam **no-store**, reduzindo risco de conteúdo antigo reaparecer

## Observação sobre persistência
Para evitar voltar dados antigos:
- o admin salva direto no Supabase pelo backend
- o painel grava o retorno salvo imediatamente no cache antes de invalidar as queries
- o site lê os dados atualizados pela API da Vercel
- `gabynails_site_settings` mantém apenas um registro válido
- uploads geram caminhos únicos no bucket

## Footer
O footer já foi ajustado para incluir:
- **feito por nexor digital group**
- link clicável para o Instagram informado
