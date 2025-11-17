#  Nutripet — Plataforma Completa de Nutrição Pet

O **Nutripet** é uma plataforma criada para oferecer análises nutricionais, consultas com nutricionistas veterinários e gestão completa da rotina alimentar de cães e gatos.  
O projeto conta com **frontend em React**, **backend Node/Express** e integração com **Cloudinary**, oferecendo uma experiência clara, intuitiva e moderna para tutores de pets.


## Tecnologias Utilizadas

### **Frontend**
- React.js  
- React Router DOM  
- Axios  
- Lucide-React (ícones)  
- CSS Modular  
- Cloudinary (exibição de imagens)  

### **Backend**
- Node.js  
- Express  
- Sequelize ORM  
- PostgreSQL  
- Multer (upload de arquivos)  
- Cloudinary (armazenamento de PDFs e imagens)

### **Infra & Utilidades**
- JWT Authentication  
- Dotenv  
- MVC Architecture  
- Validação de PDF via Buffer Header  
- Deploy-ready

##  Principais Funcionalidades

### **Área do Usuário**
- Cadastro e login
- Autenticação com JWT
- Perfil completo com menu lateral
- Página de assinatura Premium

###  **Gestão de Pets**
- Cadastrar Pet com foto
- Editar informações
- Visualização amigável no estilo ficha médica

### **Consultas Nutricionais**
- Envio de nova consulta com:
  - Dados completos do pet
  - Situações clínicas (diabetes, renal, filhote, senior etc.)
  - Upload de **PDF** com exames
- Limite de consultas baseado na assinatura
- Timeline visual para acompanhar o status
- Download de PDF finalizado da consulta

### **Tabela Nutricional**
- Avaliação automática de rações
- Análise para cães e gatos separadas
- Cálculo próprio de nutrientes

### **Recursos Premium**
- Cupons e Sorteios exclusivos
- SAC / Atendimento direto
- Consultas ilimitadas dentro do ciclo da assinatura


## Estrutura do Projeto

### **Frontend**
src/
├─ assets/
├─ components/
├─ pages/
│ ├─ MinhasConsultas/
│ ├─ NovaConsulta/
│ ├─ PlanoPremium/
│ ├─ MeuPet/
│ └─ ...
├─ services/api.js
└─ App.jsx


### **Backend**

src/
├─ controllers/
│ ├─ consultaController.js
│ ├─ usuarioController.js
│ └─ assinaturaController.js
├─ models/
│ ├─ Usuario.js
│ ├─ Consulta.js
│ └─ Assinatura.js
├─ routes/
├─ config/
│ └─ cloudinaryConfig.js
└─ app.js


## Como Rodar o Projeto Localmente

### **Backend**
cd backend
npm install
npm run dev


### Crie um arquivo .env:

DB_HOST=localhost
DB_USER=postgres
DB_PASS=senha
DB_NAME=nutripet
JWT_SECRET=sua_chave
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

### Frontend
npm install
npm start

### Segurança e Regras Importantes

- Upload de PDF é validado pelo header %PDF- antes de armazenar.
- Cada usuário só pode enviar 2 consultas por ciclo de assinatura.
- A consulta salva o snapshot dos dados do pet (não depende da tela “Meu Pet”).
- O backend mantém a lógica de negócio centralizada dentro do controller.

### Identidade Visual

O Nutripet segue uma linha visual:

- Paleta em tons creme + marrom + vinho
- Tipografia Poppins
- Layout suave com bordas arredondadas e sombras leves
- Ícones Lucide para consistência visual
