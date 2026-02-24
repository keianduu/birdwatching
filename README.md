# Birding Frame (Aves) | Fine Art Bird Photography

洗練されたエディトリアルデザインとハイエンドなインタラクションを備えた、野鳥写真家（バードウォッチャー）向けのポートフォリオ＆コミュニティサイトです。

## 🎯 Concept
ターゲットは20〜40代のカメラ・写真愛好家。「ただの写真置き場」ではなく、一枚一枚の写真をアート作品として魅せるギャラリー機能、撮影ロケーションを視覚的に伝えるマップ機能、そして撮影への意欲を高める「クエスト機能」をシームレスに統合しています。アプリライクな手触りと、ノイズレスな没入感を徹底的に追求しています。

---

## ✨ Key Features (主要機能とUXのこだわり)

### 1. 没入型フォーカスモード (Focus Mode)
- 画面右側のコンテキスト（情報）エリアを折りたたみ、ギャラリーや地図を全画面に広げるフォーカス機能を搭載。
- ブラウザの `localStorage` と連携し、TopページとMy Page間で「開閉状態」をシームレスに同期。
- 画面幅が変動した瞬間にLeafletマップのサイズ（`invalidateSize`）とMasonryレイアウトを自動再計算し、破綻のないトランジションを実現。

### 2. クリエイターダッシュボード & 月間クエスト (Field Quests)
- **Monthly Field Quests**: 毎月のお題となる野鳥を探すゲームフィケーション機能。達成度を示すプログレスバーがユーザーのモチベーション（WAKUWAKU）を刺激。
- **没入型スライドオーバーレイ**: クエスト一覧は別ページに遷移させず、画面下部からスライドインするアプリライクな全画面オーバーレイで実装。
- **スマートな投稿ハブ**: My Pageの「Post」タブから、クエスト対象の投稿と、自由な新規投稿（New Post）をシームレスに選択可能。

### 3. ダイナミック・ギャラリー & プライバシーコントロール
- **Masonry Layout**: 縦横比の異なる写真を美しく敷き詰めるレイアウト。GSAPを用いた「幕開け（Reveal）」アニメーション。
- **Visibility Control**: ユーザーは自身の写真を「Public（公開）」と「Private（非公開）」に設定可能。My Pageのギャラリーでは、3軸の洗練されたタブUIで滑らかにフィルタリング表示。

### 4. シアターモード対応 Lightbox (画像拡大)
- **PC環境**: 余計な枠やボタンの背景を排除し、巨大なシェブロン（矢印）アイコンのみを配置したミニマルなアートワーク・ファースト設計。
- **SP環境（スマホ最適化）**: 白枠を撤廃し、漆黒の背景で画面幅いっぱいに写真を最大化する「シアターモード」を採用。下へスクロールすることで撮影情報やコメントを読めるネイティブアプリのUIを踏襲。

### 5. フットプリント・マップ (Leaflet.js)
- サイトの世界観を崩さない白地図（CartoDB Light）を採用。正確な位置を伏せつつエリアを示す「波紋（エコー）マーカー」。
- マーカークリックで、そのエリアで撮影された写真が横スワイプ（`scroll-snap`）できるポップアップを展開。

### 6. マイクロインタラクション (Micro-interactions)
- **Living Logo**: ロゴ上の鳥のSVGが、CSSアニメーションにより「右へ歩き、振り返って戻ってくる」という生命感のある自然な動きをループ。
- スクロールに追従するStickyナビゲーションや、状態によってテキストが動的に切り替わるトグルスイッチなど、細部に宿る手触りを追求。

---

## 🛠 Tech Stack

- **Markup / Styling**: HTML5, CSS3 (Vanilla)
- **Logic**: Vanilla JavaScript
- **Animations**: GSAP (GreenSock Animation Platform) & ScrollTrigger
- **Mapping**: Leaflet.js
- **Fonts**: Google Fonts (`Cormorant Garamond`, `Montserrat`, `Noto Serif JP`, `Noto Sans JP`)

---

## 📁 Directory Structure

データ駆動型（Data-Driven）のアプローチを取り入れており、HTMLには空のコンテナのみを用意し、JSでデータを流し込む設計になっています。

```text
.
├── index.html       # トップページ（全体ギャラリー＆マップ）
├── mypage.html      # 会員マイページ（ダッシュボード・クエスト・投稿管理）
├── style.css        # 共通スタイルシート
├── data.js          # サイト全体の写真・エリア情報を管理するJSONライクなモックデータ
├── quest-data.js    # 月間クエストのお題と進捗を管理するデータ
├── script.js        # トップページ用ロジック（Lightbox, フィルタリング等）
└── mypage.js        # マイページ用ロジック（タブ制御, モーダル, CRUDモック等）
```

## Data Structure (data.js)

写真データは data.js 内の galleryData 配列で一元管理されています。バックエンド（DBやAPI）を接続する際は、このデータ構造をJSONとしてやり取りすることを想定しています。

```text
const galleryData = [
    {
        areaId: "shinjuku",          // エリア絞り込み用ID
        areaTitle: "Shinjuku City",  // マップポップアップ等で表示される親エリア名
        areaLocation: "Shinjuku Gyoen", // 実際の撮影場所名
        lat: 35.6938,                // 緯度（※市区町村単位などに丸めることを推奨）
        lng: 139.7034,               // 経度
        title: "01 — Majestic Owl",  // 写真タイトル
        imgThumb: "URL...",          // サムネイル画像URL
        imgFull: "URL...",           // 拡大表示用フル解像度画像URL
        author: "Yuki.K",            // 投稿者名
        avatar: "URL...",            // 投稿者アバター画像URL
        comment: "撮影時のコメント...",   // 写真のエピソードやコメント
        gear: "SONY α1 / FE 600mm..."// 撮影機材情報
    },
    // ...
];
```

## Notes for Developers (開発者への引き継ぎ事項)

### イベントの競合回避について
- トップページの script.js ではギャラリーカードのクリックでLightboxが開きますが、mypage.js ではカード上の「Edit / Delete」アイコンクリック時にLightboxが開かないよう、意図的に e.stopPropagation() やイベントの分離を行っています。

### 画像の比率とCSS設定
- アバター画像等の丸抜き画像が引き伸ばされないよう、style.css にて .author-avatar に対して !important 規則を設けてサイズを保護しています。

### ダミー操作について
- 現在の Edit / Delete 機能や、画像のアップロードプレビュー機能は、フロントエンドのみで完結する擬似的な処理（モック）です。ブラウザをリロードすると data.js の初期状態に戻ります。実運用時はこれらのロジックを非同期通信（fetch や axios）に置き換えてください。

### LocalStorage の活用
- フォーカスモード（全画面表示）の状態は localStorage.getItem('aves_focus_mode') で管理されています。リセットが必要な場合はブラウザの開発者ツールからStorageをクリアしてください。

### Leafletマップの再計算バグ回避
- ギャラリーと地図のタブ切り替え時や、フォーカスモードの開閉時に地図の描画がバグる（グレーになる）のを防ぐため、display: block になった直後（10msの遅延後）に birdMapInstance.invalidateSize() を強制発火させるフェイルセーフを script.js と mypage.js の両方に組み込んでいます。

### モックデータとCRUD操作
- 現在、写真の投稿・編集・削除、およびクエストの達成処理は、フロントエンドのみで完結する擬似的な処理（モック）です。ブラウザをリロードすると data.js と quest-data.js の初期状態に戻ります。
バックエンド開発に移行する際は、各モーダルの submit 関数内にあるDOM更新処理を維持しつつ、データの送受信ロジック（fetch や axios）に置き換えてください。UIの滑らかな変化（再レンダリングの最小化）は現在のJSで担保されています。
