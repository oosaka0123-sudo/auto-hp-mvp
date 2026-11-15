# Web Design Master 適用QA（2026-11-15）

| 領域 | 判定 | 証拠・理由 |
| --- | --- | --- |
| マスター正本参照 | PASS | web-design-master mainのDESIGN_SYSTEM、DIRECTION_QA、SITE_SHELL_STANDARD、BRAND_ASSETS_STANDARD、WORKFLOW_3AIを確認 |
| 共通UIコード | PASS | SiteFooter.astro、master-integration.css、share.js、src/master/* |
| ファビコン | PASS（静的） | public/favicon.svg、BaseLayout参照。ブラウザタブ目視はNOT_TESTED |
| 透明PNGロゴ | PASS（ファイル） | public/assets/brand/auto-site-logo.png と sample-surf-logo.png。ヘッダーでの表示はNOT_TESTED |
| CTA | FAIL（公開ゲート） | 問い合わせメール・フォーム未設定。虚偽の連絡先は入れない |
| CI・ビルド | PASS | PR CI 43680477717 成功。PC04で `npm run check` / `npm test` / `npm run build` / `npm run verify` を実行し、7ページの検証成功 |
| 画面 320/360/375/390/430px | NOT_TESTED | 実ブラウザ検証未実施 |
| PC/タブレット | NOT_TESTED | 実ブラウザ検証未実施 |
| キーボード・共有・reduced-motion | NOT_TESTED | コードは実装。実機操作の証拠なし |
| Lighthouse / LCP / INP / CLS | NOT_TESTED | 実測なし |
| 3AI独立制作 | NOT_TESTED | Claude/Gemini案の実行証拠なし |
| 料金・文言・法務 | NOT_TESTED | 実事業者確認未実施 |
| GitHub Pagesプレビュー | PASS（HTTP/配備） | Actions 43680475589 成功。両ページとPNGロゴ2点がHTTP 200。視覚・操作はNOT_TESTED。PR未マージ |

未確認をPASSと扱わない。マスター仕様に完全準拠したという完了判定はまだ行わない。
