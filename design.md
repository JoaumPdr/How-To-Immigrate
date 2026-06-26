# Sistema de Design Visual (Design System) — How To Immigrate

Este documento define de forma detalhada o design system, os componentes base reutilizáveis, os tokens visuais e as regras de responsividade para o projeto **How To Immigrate**. Este é um contrato visual e técnico obrigatório que deve ser seguido em todas as próximas etapas de desenvolvimento.

---

## 1. Tokens Visuais (Tailwind CSS v4)

Os tokens do design system estão centralizados em `app/globals.css` utilizando a diretiva `@theme` do Tailwind CSS v4.

### 1.1 Cores e Modos (Light & Dark)

| Token CSS / Semântico | Valor (Light Mode) | Valor (Dark Mode) | Uso no Layout |
| :--- | :--- | :--- | :--- |
| `--color-background` | `hsl(0 0% 100%)` | `hsl(224 71.4% 4.1%)` | Fundo principal da página |
| `--color-foreground` | `hsl(224 71.4% 4.1%)` | `hsl(210 20% 98%)` | Cor padrão de texto principal |
| `--color-card` | `hsl(0 0% 100%)` | `hsl(224 71.4% 4.1%)` | Fundo de Cards, Modais e Sheets |
| `--color-card-foreground` | `hsl(224 71.4% 4.1%)` | `hsl(210 20% 98%)` | Texto sobre superfícies de Cards |
| `--color-primary` | `hsl(224.3 76.3% 48%)` (Azul) | `hsl(210 20% 98%)` (Branco/Cinza) | Botões principais, status de foco |
| `--color-primary-foreground`| `hsl(210 20% 98%)` | `hsl(224.3 76.3% 48%)` | Texto sobre botões principais |
| `--color-secondary` | `hsl(220 14.3% 95.9%)` | `hsl(215 27.9% 16.9%)` | Elementos de segundo plano, seletores |
| `--color-muted-foreground` | `hsl(220 8.9% 46.1%)` | `hsl(217.9 10.6% 64.9%)` | Subtítulos e textos secundários |
| `--color-border` | `hsl(220 13% 91%)` | `hsl(215 27.9% 16.9%)` | Bordas e linhas divisórias |

### 1.2 Cores de Domínio e Semânticas
- **Sucesso / Vistos Facilitados:** `--color-brand-emerald` (`#10b981`)
- **Atenção / Dificuldade Média:** `--color-brand-amber` (`#f59e0b`)
- **Destrutivo / Dificuldade Alta:** `hsl(0 84.2% 60.2%)`
- **Oceano (Mapa Interativo):** `--color-ocean` (`#f0f4f8`) | `--color-ocean-dark` (`#0f172a`)
- **Destaques / Trilhas:** `--color-brand-indigo` (`#4f46e5`)

### 1.3 Tipografia
- **Font-sans:** Geist Sans (Interface e texto padrão)
- **Font-mono:** Geist Mono (Dados numéricos e código)
- **Títulos (Hero):** Extrabold/Black com gradiente linear dinâmico.
- **Escala de Texto Responsivo:**
  - Hero Title: `text-4xl sm:text-6xl lg:text-7xl`
  - Títulos Secundários: `text-2xl sm:text-4xl`
  - Corpo de texto: `text-sm sm:text-base`
  - Rótulos/Legendas: `text-xs`

### 1.4 Bordas e Sombras
- **Raio de Borda (Radius):** `--radius` (`0.75rem` / 12px).
- **Variações de Raio:** `radius-sm` (8px), `radius-md` (10px), `radius-lg` (12px).
- **Sombras (Shadows):**
  - Botão Principal: `shadow-md shadow-primary/10`
  - Card (Hover): `hover:shadow-md` e `-translate-y-0.5` para dar sensação de profundidade tridimensional.

---

## 2. Componentes Base do Design System

Todos os componentes abaixo foram implementados sob a pasta `components/ui/` utilizando as novas diretrizes do Tailwind CSS v4.

### 2.1 Button (`Button.tsx`)
- **Variantes:**
  - `primary`: Botão principal preenchido (cor de destaque).
  - `secondary`: Botão secundário de apoio.
  - `outline`: Botão com contorno sutil de borda.
  - `ghost`: Botão sem fundo que aparece apenas no hover.
  - `destructive`: Botão vermelho para ações de alto risco.
- **Tamanhos:** `sm` (pequeno), `md` (padrão), `lg` (grande).
- **Estados:** `disabled`, `isLoading` (exibe spinner animado e desativa clique), e `aria-busy` ativo para leitores de tela.

### 2.2 Card (`Card.tsx`)
- Divisor de blocos estruturais de dados de países e artigos.
- Suporta a propriedade `isHoverable` que adiciona efeitos de animação 3D sutil ao passar o mouse.
- Subcomponentes incluídos: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

### 2.3 Badge (`Badge.tsx`)
- Rótulos visuais para indicação rápida de status de países (continente, vistos, scores).
- Variantes semânticas: `primary`, `secondary`, `outline`, `success` (verde), `warning` (amarelo), `destructive` (vermelho).

### 2.4 Input (`Input.tsx`)
- Entrada de formulário com anel de foco personalizado (`ring-offset`) para acessibilidade.
- Suporta a propriedade `hasError` que colore a borda em vermelho e ativa o estado `aria-invalid="true"`.

### 2.5 Select (`Select.tsx`)
- Menu dropdown construído sobre o elemento `<select>` nativo, garantindo total suporte a navegação por teclado e compatibilidade com seletores nativos de dispositivos móveis.
- Acompanha ícone de chevron indicador customizado.

### 2.6 Modal (`Modal.tsx`)
- Caixa de diálogo com Portal para renderização limpa no final do body.
- **Acessibilidade:** Implementado com Focus Trap (tabulação restrita dentro do diálogo), fechamento ao clicar no botão de fechar, no overlay externo ou pressionando a tecla `Esc` (conforme WCAG AA).

### 2.7 Sheet (`Sheet.tsx`)
- Painel de navegação deslizante. Suporta direções `left` (menu lateral), `right` (painel principal) e `bottom` (painel móvel inferior).
- Utilizado para o menu hambúrguer responsivo no mobile.

### 2.8 Tooltip (`Tooltip.tsx`)
- Balão explicativo posicionado acima do elemento acionador.
- Ativa automaticamente no mouse hover e no foco por teclado (`onFocus` / `onBlur`).

### 2.9 LoadingSpinner (`LoadingSpinner.tsx`)
- Indicador visual em SVG animado rotacional, acompanhado de descrição oculta (`sr-only`) para leitores de tela.

### 2.10 EmptyState (`EmptyState.tsx`)
- Feedback visual contendo imagem/ícone, título, descrição e botão de ação para cenários onde buscas de países ou avaliações retornam vazias.

### 2.11 ErrorBoundary (`ErrorBoundary.tsx`)
- Class component que captura exceções em tempo de renderização em componentes filhos e providencia um botão para reinicializar o estado do fluxo sem forçar a quebra do restante do site.

---

## 3. Diretrizes de Responsividade & Área de Toque

1. **Breakpoints Mobile-First:**
   - **Mobile (`< 640px`):** Navbar colapsa. Elementos são alinhados verticalmente em uma única coluna. O Sheet lateral abriga os links de navegação.
   - **Tablet (`640px–1024px`):** Navbar simplificada.
   - **Desktop (`> 1024px`):** Interface estendida completa em colunas horizontais.
2. **Área de Toque Mínima (Touch Target):**
   - Todos os elementos interativos possuem área clicável mínima de **44px × 44px** em telas pequenas para evitar cliques incorretos de dedos.
3. **Prevenção contra Overflow:**
   - Todas as resoluções de tela de até **375px** (iPhone SE) foram validadas e nenhuma página ou componente gera barra de rolagem horizontal.

---

## 4. Componentes Testados e Validados (Suíte E2E & Snapshot)

Todos os componentes primitivos possuem testes automatizados de snapshot em `__tests__/components.test.tsx` e foram validados em produção. O comportamento responsivo da Navbar e do Footer, a persistência da escolha do idioma (next-intl cookies) e a persistência da escolha de tema (localStorage class list) estão cobertos por testes de integração de interface no Playwright.
