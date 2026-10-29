# Método ASA — LP de lançamento

Página estática: `index.html` + `css/styles.css` + `js/main.js` (GSAP 3.12.5 via cdnjs).

- Fonte: RBNo3.1 (René Bieder), servida de `fonts/` em woff2. **É uma fonte comercial; o arquivo original só permite preview/print. Publicar exige licença web.**
- Paleta: laranja-avermelhado `#FF4D1F` como destaque, amarelo `#FFC21A` nos detalhes.
- Objetos 3D de vidro (`assets/3d/`) e pôsteres do "O que está incluso" (`assets/modulos/`) gerados no Freepik/Magnific. Para usar as logos oficiais da Shopee e do Mercado Livre, basta trocar os `<img class="obj ...">` do hero.

Para ver localmente: `python3 -m http.server` na raiz e abrir `http://localhost:8000`.

## Deploy na Vercel
Site estático, sem build. Na Vercel: *Add New → Project*, importe o repositório, deixe *Framework Preset* em **Other**, sem comando de build e com *Output Directory* vazio (raiz). Se o repositório só tiver esta branch, defina-a como *Production Branch* em *Settings → Git*.

- Copy: `docs/copy.md`
- Leitura das referências: `docs/referencias.md`

## Assets
Nenhum placeholder restante. Prints reais em `assets/resultados/`, moldura de celular (mockup Freepik "Modern White Smartphone Mockup on Transparent Background", tela recortada) em `assets/phone-frame.webp`.

Preço: de R$ 159,00 por R$ 47,90. Checkout Kiwify no botão da oferta (`#oferta .btn--block`); os demais CTAs rolam até a oferta. Google Tag Manager: `GTM-5FKNZRK3` (no `<head>` e o `noscript` logo após o `<body>`).
