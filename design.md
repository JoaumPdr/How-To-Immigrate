# Diretrizes de Design e Responsividade — How To Immigrate

Este documento define os tokens visuais e as restrições arquiteturais de interface e responsividade do projeto **How To Immigrate**. Toda interface visual criada nas próximas etapas deve obedecer rigorosamente a este guia.

---

## 1. Design Tokens (Tailwind CSS v4)

Nossos tokens de estilo estão mapeados no arquivo `app/globals.css` utilizando a diretiva `@theme` do Tailwind CSS v4.

### 1.1 Paleta de Cores
- **Fundo (Background):** `hsl(0 0% 100%)` (Claro) | `hsl(224 71.4% 4.1%)` (Escuro / Dark Slate)
- **Frente (Foreground):** `hsl(224 71.4% 4.1%)` (Claro) | `hsl(210 20% 98%)` (Escuro)
- **Primary:** `hsl(224.3 76.3% 48%)` (Azul Royal) | `hsl(210 20% 98%)` (Dark mode)
- **Brand Indigo (Destaques e Fluxos):** `#4f46e5`
- **Brand Emerald (Valores, Sucesso, Facilidade):** `#10b981`
- **Brand Amber (Destaques, Atenção, Alertas):** `#f59e0b`
- **Ocean (Mapa Interativo):** `#f0f4f8` (Oceanos no modo claro) | `#0f172a` (Oceanos no modo escuro)

### 1.2 Tipografia e Bordas
- **Font-sans:** Geist Sans (Padrão moderna)
- **Font-mono:** Geist Mono
- **Border-radius:** `var(--radius)` definido como `0.75rem` (12px) para componentes de cards, inputs e modals.

---

## 2. Restrição Arquitetural: Responsividade Mobile-First

A responsividade é uma restrição transversal de desenvolvimento. Os layouts da aplicação, especialmente o mapa interativo (Etapa 03) e os dashboards analíticos (Etapa 04+), devem nascer adaptados ao mobile.

### 2.1 Breakpoints do Projeto
- **Mobile (`< 640px`):** Navbar é colapsada em menu hambúrguer (ou gaveta inferior), o mapa interativo é substituído por uma lista de rolagem ou abas e as tabelas e painéis horizontais viram pilhas verticais.
- **Tablet (`640px` a `1024px`):** Layouts híbridos. A navbar é simplificada, o mapa possui zoom e escala de exibição reduzida e painéis analíticos passam a usar layouts de duas colunas.
- **Desktop (`> 1024px`):** Experiência completa com barra lateral de navegação ou navbar superior expandida, mapas em tela inteira (full-screen) e painéis com até quatro colunas.

### 2.2 Área de Toque Mínima (Touch Target)
- Todos os elementos acionáveis (botões, links, inputs, checkboxes) devem possuir uma área de toque mínima de **44px × 44px** no mobile para garantir acessibilidade física.
- Margens e espaçamentos adequados para evitar cliques acidentais.

### 2.3 Prevenção de Overflow Horizontal
- O elemento `body` possui `overflow-x: hidden` como segurança de última linha.
- Todo layout deve usar grids responsivos (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) ou Flexbox com wrap (`flex-wrap`) para garantir que nenhum elemento cause overflow em larguras de até **375px** (resolução do iPhone SE / mobile pequeno).

---

## 3. Estratégia de Testes de Responsividade

Toda alteração de layout visual ou novo componente UI deve ser testado nas 3 resoluções descritas acima.

### 3.1 Projetos do Playwright (E2E)
O arquivo `playwright.config.ts` está configurado para executar automaticamente todas as suítes de teste de interface nas seguintes viewports:
1. **mobile:** 375px × 667px
2. **tablet:** 768px × 1024px
3. **desktop:** 1440px × 900px

Qualquer falha de layout (vazamento de texto, sobreposição ou overflow) nessas 3 resoluções travará o merge da branch.
