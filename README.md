# Método ASA — LP de lançamento

Página estática: `index.html` + `css/styles.css` + `js/main.js` (GSAP 3.12.5 via cdnjs, fontes Anton e Inter Tight via Google Fonts).

Para ver localmente: `python3 -m http.server` na raiz e abrir `http://localhost:8000`.

- Copy: `docs/copy.md`
- Leitura das referências: `docs/referencias.md`

## Assets pendentes
Cada um aparece na página como placeholder tracejado com o nome do arquivo. Ao colocar o arquivo em `assets/`, troque o `<div class="asset ...">` correspondente por `<img src="assets/..." alt="...">` mantendo as demais classes.

| Arquivo | Onde |
|---|---|
| `mockup-area-membros.png`, `mockup-aula-02.png`, `mockup-aula-03.png` | card "+25 aulas" (02) |
| `print-resultado-01..05.png` | leque de prints (05) — prints reais, formato vertical 9:16 |
| `mockup-produto-asa.png`, `mockup-celular-aulas.png` | ao lado do card de oferta (07) |

Preço segue como `R$ XXX` / `R$ XX,XX` até definição. O botão de compra (`#oferta .btn--block`) está com `href="#"`: trocar pelo link do checkout.
