# Web Design Master 適用設計（2026-11-15）

正本: oosaka0123-sudo/web-design-master の DESIGN_SYSTEM.md / DIRECTION_QA.md / SITE_SHELL_STANDARD.md / BRAND_ASSETS_STANDARD.md / WORKFLOW_3AI.md。

## 対象
- AUTO SITE: サーフショップ向け制作サービスのLP。CTAは問い合わせ窓口未設定のため「準備中」。
- SAMPLE SURF: 架空店舗のデモ。観測・予報ではないサンプル波情報。予約フォームは動作させない。
- 両方とも Astro 5、GitHub Pages、既存レイアウトを維持。

## 採用仕様
- マスター由来の `ks-design.css` / `ks-motion.js` を案件内 `src/master/` に保持。
- 軽量CSS、IntersectionObserver、prefers-reduced-motion、外部トラッカーなし。
- 共有コンポーネント `SiteFooter.astro` でサイト別のブランドロゴ、ナビ、共有、RSS7クレジットを統一。
- 透明PNGは既存のAUTO SITE波ロゴとSAMPLE SURFの波・太陽モチーフを基にした暫定版。ブランド最終承認は未実施。
- フッターの共有は Web Share API、非対応時はURLコピー。実機テストは未完了。

## 未実施・保留
- 3AI独立案と選抜統合（ChatGPT実装のみ。Claude/Gemini未実施）
- 320/360/375/390/430px、タブレット、PCの実画面・キーボード操作
- Lighthouse、LCP/INP/CLS、スクリーンリーダー、共有成功/キャンセル
- 問い合わせ先・正式URLによる公開前ゲート（公開中URLはプレビュー扱い）
- 写真素材とライセンス確認（現段階はSVG中心）
