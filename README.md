# Método ASA — LP de lançamento

Página estática: `index.html` + `css/styles.css` + `js/main.js` (GSAP 3.12.5 via cdnjs).

- Fonte: Oxanium (licença OFL, uso livre), variável 400–800, servida de `fonts/oxanium.woff2` (subset latin, 14 KB).
- Paleta: laranja-avermelhado `#FF4D1F` como destaque, amarelo `#FFC21A` nos detalhes.
- Objetos 3D de vidro (`assets/3d/`) e pôsteres do "O que está incluso" (`assets/modulos/`) gerados no Freepik/Magnific. Para usar as logos oficiais da Shopee e do Mercado Livre, basta trocar os `<img class="obj ...">` do hero.

Para ver localmente: `python3 -m http.server` na raiz e abrir `http://localhost:8000`.

## Páginas
- `index.html`: landing page. Sem alegações de ganho (seção de resultados e prints de painel removidos em 30/10/2026).
- `politica-de-privacidade.html` e `termos-de-uso.html`: textos genéricos em nome do Método ASA, sem CNPJ. Revise com um advogado e complete com os dados do responsável antes de escalar.
- Aviso de cookies: guarda a escolha em `localStorage` (`asa-consent`), envia `consent update` do Google Consent Mode e os eventos `cookie_consent_granted` / `cookie_consent_denied` no `dataLayer`. Configure as tags do GTM (Meta, GA4, Ads) para respeitar o consentimento.

## Imagens para a Kiwify
Em `kiwify/` (fora do site): cards da área de membros (`modulos/`, 1024×1536, 2:3) e banner do slide (`banner/`, desktop 2000×590 e mobile 768×432, com e sem texto).

## Build e deploy na Hostinger
```
npm install
npm run build
```
Gera `dist/` e `metodoasa-site.zip`. O build embute o CSS no HTML, minifica HTML e JS (com hash no nome do JS para cache), copia fontes, imagens, `.htaccess`, `robots.txt` e `sitemap.xml`.

Na Hostinger: hPanel → Sites → Gerenciador de Arquivos → `public_html` → Upload do `metodoasa-site.zip` → botão direito → Extrair. O `index.html` precisa ficar direto em `public_html`. Depois ative o SSL e a opção **Forçar HTTPS** no hPanel. O `.htaccess` já liga compressão e cache.

## Deploy na Vercel
Site estático, sem build. Na Vercel: *Add New → Project*, importe o repositório, deixe *Framework Preset* em **Other**, sem comando de build e com *Output Directory* vazio (raiz). Se o repositório só tiver esta branch, defina-a como *Production Branch* em *Settings → Git*.

- Copy: `docs/copy.md`
- Leitura das referências: `docs/referencias.md`

## Assets
Nenhum placeholder restante. Prints reais em `assets/resultados/`, moldura de celular (mockup Freepik "Modern White Smartphone Mockup on Transparent Background", tela recortada) em `assets/phone-frame.webp`.

Preço: de R$ 159,00 por R$ 67,00. Checkout Kiwify no botão da oferta (`#oferta .btn--block`); os demais CTAs rolam até a oferta. Google Tag Manager: `GTM-5FKNZRK3` (no `<head>` e o `noscript` logo após o `<body>`).
