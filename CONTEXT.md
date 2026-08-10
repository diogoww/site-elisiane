# Contexto do Projeto — Site Elisiane Varaschin

> Arquivo de contexto para colar em conversas com IA/LLMs ou compartilhar com outros devs. Resume o projeto inteiro: propósito, stack, estrutura, arquivos-chave e decisões de design já tomadas.

## O que é

Site institucional **one-page** para **Elisiane Varaschin**, restauradora de imagens religiosas (arte sacra). Objetivo: apresentar o ateliê, mostrar restaurações reais com um comparador interativo "antes/depois" e converter visitantes em contato via WhatsApp/Instagram.

Desenvolvido por **Diogo José Varaschin de Oliveira** (autor deste repo).

- Site ao vivo: nenhum build, é HTML estático — abrir `index.html` ou servir com qualquer servidor estático.
- Idioma: português brasileiro (`pt-BR`), tom devocional/institucional.

## Stack

**HTML5 + CSS3 + JavaScript puro (vanilla), sem frameworks, sem bibliotecas, sem etapa de build.** Fontes via Google Fonts (`Cormorant Garamond` para serifada/títulos, `Lato` para sans/corpo).

```
├── index.html        # marcação e todo o conteúdo textual (pt-BR)
├── css/styles.css     # paleta, layout, componentes — mobile-first, BEM-like
├── js/script.js       # menu, reveal-on-scroll, comparador, lightbox, smooth scroll
├── assets/            # fotos (.webp), logo (.jpeg), favicon (.jpg)
└── README.md          # apresentação do projeto (público, com badges)
```

Não há `package.json`, testes, linter ou CI configurados. É um projeto estritamente front-end estático.

## Estrutura de conteúdo (`index.html`)

Seções, em ordem, cada uma com `id` usado na navegação:

1. **Header fixo** (`#site-header`) — logo/nome "Elisiane Varaschin", nav com âncoras (Sobre, Restaurações, Contato), botão WhatsApp, menu hamburguer mobile.
2. **Hero** (`#inicio`) — título "Restauração de Imagens Sacras", subtítulo, CTA para a galeria, ornamento com glifo de cruz (✝), scroll hint animado.
3. **Sobre** (`#sobre`) — retrato de Elisiane + texto em primeira pessoa sobre a vocação.
4. **Galeria / Restaurações** (`#restauracoes`) — grid de `restoration-card`, cada um com um `comparison-slider` (antes/depois). Peças atuais: **Cristo Crucificado**, **Nossa Senhora Aparecida**, **Santa Teresinha**, **São Lázaro**.
5. **Citação bíblica** (`.verse`) — Salmos 90:2, fundo navy.
6. **Texto de impacto** (`.impact`) — bloco reflexivo ("O tempo pode deixar marcas. A fé, nunca.").
7. **Contato** (`#contato`) — cards de WhatsApp ((43) 99875-2725) e Instagram (@elisiane.consultora).
8. **Footer** — copyright, assinatura do desenvolvedor.
9. **Lightbox** (`#lightbox`) — modal fora do `<main>`, reaproveita o mesmo componente de comparador em tamanho ampliado.

SEO/metadados já configurados: Open Graph, `theme-color`, JSON-LD `schema.org/LocalBusiness` (telefone, imagem, redes sociais).

## Componentes JS (`js/script.js`, IIFE única, sem módulos)

- **Header on scroll** — classe `is-scrolled` após 12px de rolagem (sombra).
- **Menu mobile** — toggle com `aria-expanded`, fecha ao clicar em link ou `Esc`.
- **Reveal on scroll** — `IntersectionObserver` adiciona `.is-visible` a elementos `.reveal` (fallback: mostra tudo se API ausente).
- **`ComparisonSlider` (classe)** — núcleo do comparador antes/depois:
  - Usa `clip-path: inset()` no painel "before" para revelar/esconder.
  - Suporta arraste por `pointerdown/move/up` (mouse e touch via Pointer Events), teclado (setas ←/→, `role="slider"`), e clique direto na imagem para posicionar.
  - Reutilizada tanto nos cards da galeria quanto no lightbox (mesma classe, instância separada).
- **Lightbox** — abre ao clicar na imagem do card (não no handle), guarda o elemento que tinha foco antes (`lastFocusedElement`) para devolver o foco ao fechar (acessibilidade), fecha com `Esc`, clique no backdrop ou botão `×`.
- **Smooth scroll customizado** — reimplementação manual via `wheel` + `requestAnimationFrame` com interpolação (`EASE = 0.1`), porque precisa funcionar **independente** da preferência `prefers-reduced-motion`/config do SO (decisão explícita, ver commit `2dadd30`). Ignora rolagem horizontal e é desativado enquanto o lightbox está aberto.

## Decisões de design / paleta (`css/styles.css`)

Custom properties centralizadas em `:root`:
- Cores: navy (`#2b4871`) como cor de marca, terracota (`#bf7a56`) como acento/CTA secundário, bege/ivory como fundos claros.
- Tipografia: serifada (`Cormorant Garamond`) para headings/citações, sans (`Lato`) para corpo, peso leve (300) por padrão.
- Mobile-first, breakpoints principais em `640px`, `860px`, `1024px`.
- Acessibilidade: skip link, `prefers-reduced-motion` respeitado nas transições/animações CSS (mas não no smooth scroll JS, que é intencionalmente sempre ativo), `aria-*` em nav e slider.
- Imagens de restauração em `.webp` (convertidas/otimizadas do formato original para reduzir peso — ver commit `eeb5e74`).

## Histórico relevante (git log, mais recentes primeiro)

- `2dadd30` fix: rolagem suave funciona independente da config de movimento do sistema
- `eeb5e74` perf: imagens convertidas para WebP + otimização de tamanho
- `f89df38` chore: pasta `awesome-claude-code-subagents-main` (agentes do Claude Code, não faz parte do site) removida do versionamento — **ainda existe em disco localmente mas está no `.gitignore`, não é parte do projeto do site**
- `f20c9b1` docs: README criado
- `98dbb5b` style: peso de fonte dos textos em azul aumentado (legibilidade)
- Commits anteriores: ajustes visuais incrementais (paleta de azul, ornamentos, posição da logo no hero, enquadramento das imagens do comparador, salmo citado, etc.)

## Contato / dados de negócio (reais, usados no site)

- WhatsApp: `+55 43 99875-2725` (link `wa.me` com mensagem pré-preenchida)
- Instagram: `@elisiane.consultora`

## O que falta / não existe neste projeto

- Sem backend, sem formulário de contato server-side (tudo via link direto para WhatsApp/Instagram).
- Sem testes automatizados.
- Sem pipeline de build/CI.
- `awesome-claude-code-subagents-main/` no diretório raiz é um submódulo/pasta de ferramentas do Claude Code (não relacionado ao site) e está fora do versionamento.