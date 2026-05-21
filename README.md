# Dikastis Lens

Extensão Chrome de apoio à monitoria de Introdução à Programação do CIn/UFPE.

## Stack

- **TypeScript** — tipagem estática
- **Vite** — bundler rápido
- **@crxjs/vite-plugin** — integração Vite ↔ Chrome Extension (Manifest V3)

## Como rodar em desenvolvimento

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o modo watch:

   ```bash
   npm run dev
   ```

3. No Chrome, acesse `chrome://extensions`, ative o **Modo desenvolvedor** e clique em **Carregar sem compactação**. Selecione a pasta `dist/` gerada na raiz do projeto.

## Build de produção

```bash
npm run build
```

A saída será gerada em `dist/`.

## Ícones

Adicione arquivos PNG nos tamanhos **16×16**, **48×48** e **128×128** em `public/icons/`:

```
public/icons/icon16.png
public/icons/icon48.png
public/icons/icon128.png
```

Esses ícones são referenciados pelo `manifest.json` e exibidos na toolbar e na Chrome Web Store.
