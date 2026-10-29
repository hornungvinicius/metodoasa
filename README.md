# Método ASA — LP de lançamento

Página estática: `index.html` + `css/styles.css` + `js/main.js` (GSAP 3.12.5 via cdnjs).

- Fonte: RBNo3.1 (René Bieder), servida de `fonts/` em woff2. **É uma fonte comercial; o arquivo original só permite preview/print. Publicar exige licença web.**
- Paleta: laranja-avermelhado `#FF4D1F` como destaque, amarelo `#FFC21A` nos detalhes.
- Objetos 3D de vidro do hero (`assets/3d/`) gerados no Freepik/Magnific. Para usar as logos oficiais da Shopee e do Mercado Livre, basta trocar os `<img class="obj ...">` do hero.

Para ver localmente: `python3 -m http.server` na raiz e abrir `http://localhost:8000`.

- Copy: `docs/copy.md`
- Leitura das referências: `docs/referencias.md`

## Assets
Nenhum placeholder restante. Prints reais em `assets/resultados/`, moldura de celular (mockup Freepik "Modern White Smartphone Mockup on Transparent Background", tela recortada) em `assets/phone-frame.webp`.

Preço segue como `R$ XXX` / `R$ XX,XX` até definição. O botão de compra (`#oferta .btn--block`) está com `href="#"`: trocar pelo link do checkout.
