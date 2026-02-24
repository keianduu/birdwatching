// --- data.js ---
// サイト全体の写真・エリア情報を管理するデータソース

const galleryData = [
    {
        areaId: "shinjuku",
        areaTitle: "Shinjuku City",
        areaLocation: "Shinjuku Gyoen",
        lat: 35.6938, // 新宿区の基準座標に統一
        lng: 139.7034,
        title: "01 — Majestic Owl",
        imgThumb: "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?q=80&w=800&auto=format&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?q=80&w=1600&auto=format&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "静寂の中、ふと枝に舞い降りた瞬間を捉えました。光の差し込み具合が奇跡的で、息を飲む美しさでした。",
        gear: "SONY α1 / FE 600mm F4 GM OSS"
    },
    {
        areaId: "shinjuku",
        areaTitle: "Shinjuku City",
        areaLocation: "Shinjuku Gyoen",
        lat: 35.6938,
        lng: 139.7034,
        title: "02 — Night Watcher",
        imgThumb: "https://plus.unsplash.com/premium_photo-1724864863815-1469c8b74711?q=80&w=987&auto=format&fit=crop",
        imgFull: "https://plus.unsplash.com/premium_photo-1724864863815-1469c8b74711?q=80&w=1600&auto=format&fit=crop",
        author: "Daiki.M",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
        comment: "夜の闇に溶け込むような姿。僅かな月明かりを頼りに、なんとかピントを合わせることができました。",
        gear: "Nikon Z9 / NIKKOR Z 400mm f/2.8 TC VR S"
    },
    {
        areaId: "taito",
        areaTitle: "Taito City",
        areaLocation: "Ueno Park",
        lat: 35.7126, // 台東区（上野周辺）の基準座標に統一
        lng: 139.7802,
        title: "03 — Sky Dance",
        imgThumb: "https://images.unsplash.com/photo-1507091249509-ea24980b1218?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1507091249509-ea24980b1218?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "抜けるような青空をキャンバスに、優雅に舞う姿。シャッタースピードを極限まで上げて水飛沫ごと切り取りました。",
        gear: "SONY α1 / FE 600mm F4 GM OSS"
    },
    {
        areaId: "musashino",
        areaTitle: "Musashino City",
        areaLocation: "Inokashira Park",
        lat: 35.7009, // 武蔵野市（吉祥寺周辺）の基準座標に統一
        lng: 139.5750,
        title: "04 — Elegance",
        imgThumb: "https://images.unsplash.com/flagged/photo-1565669288742-21ad6e7379f4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
        imgFull: "https://images.unsplash.com/flagged/photo-1565669288742-21ad6e7379f4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Kenji.S",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
        comment: "水面に浮かぶその姿は、まるで計算された彫刻のように完璧な曲線美を持っていました。",
        gear: "Canon EOS R3 / RF600mm F4 L IS USM"
    },
    {
        areaId: "musashino",
        areaTitle: "Musashino City",
        areaLocation: "Inokashira Park",
        lat: 35.7009,
        lng: 139.5750,
        title: "05 — Water Bird",
        imgThumb: "https://images.unsplash.com/photo-1480044965905-02098d419e96?q=80&w=800&auto=format&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1480044965905-02098d419e96?q=80&w=1600&auto=format&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "夕日に染まる水面を滑るように進む姿。コントラストを強めに現像し、ドラマチックな雰囲気を強調しました。",
        gear: "SONY α1 / FE 100-400mm F4.5-5.6 GM OSS"
    },
    {
        areaId: "musashino",
        areaTitle: "Musashino City",
        areaLocation: "Inokashira Park",
        lat: 35.7009,
        lng: 139.5750,
        title: "06 — Predator",
        imgThumb: "https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dfit=crop",
        imgFull: "https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Daiki.M",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
        comment: "獲物を狙う鋭い眼光。この1枚を撮るために、同じ場所で3時間待ち続けました。",
        gear: "Nikon Z9 / NIKKOR Z 400mm f/2.8 TC VR S"
    },
    {
        areaId: "shibuya",
        areaTitle: "Shibuya City",
        areaLocation: "Yoyogi Park",
        lat: 35.6619, // 渋谷区（代々木・明治神宮）の基準座標に統一
        lng: 139.7040,
        title: "07 — Tiny Messenger",
        imgThumb: "https://images.unsplash.com/photo-1523115191856-c203e76215a5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1523115191856-c203e76215a5?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Kenji.S",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
        comment: "都会のど真ん中に残された緑のオアシス。木漏れ日の中で忙しく動き回る小さな命にピントを合わせました。",
        gear: "Canon EOS R3 / RF100-500mm F4.5-7.1 L IS USM"
    },
    {
        areaId: "edogawa",
        areaTitle: "Edogawa City",
        areaLocation: "Kasai Rinkai Park",
        lat: 35.7066, // 江戸川区の基準座標に統一
        lng: 139.8690,
        title: "08 — Ocean Breeze",
        imgThumb: "https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=800&auto=format&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=1600&auto=format&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "海風を受けながら空を舞うユリカモメ。背景の青い海を適度にぼかして、爽やかな空気感を演出しています。",
        gear: "SONY α1 / FE 600mm F4 GM OSS"
    },
    {
        areaId: "edogawa",
        areaTitle: "Edogawa City",
        areaLocation: "Kasai Rinkai Park",
        lat: 35.7066,
        lng: 139.8690,
        title: "09 — The Takeoff",
        imgThumb: "https://images.unsplash.com/photo-1511154891408-20e5f9551a19?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1511154891408-20e5f9551a19?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Daiki.M",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
        comment: "干潟から飛び立つ直前の緊迫した瞬間。その力強さと水飛沫の躍動感を捉えるため、低角度から連写で狙い撃ちしました。",
        gear: "Nikon Z9 / NIKKOR Z 800mm f/6.3 VR S"
    },
    {
        areaId: "shibuya",
        areaTitle: "Shibuya City",
        areaLocation: "Meiji Jingu Forest",
        lat: 35.6619, // 渋谷区（代々木・明治神宮）の基準座標に統一
        lng: 139.7040,
        title: "10 — Emerald Diver",
        imgThumb: "https://images.unsplash.com/photo-1620588280140-9b4f6a2d679c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dfit=crop",
        imgFull: "https://images.unsplash.com/photo-1620588280140-9b4f6a2d679c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "静かな森の奥、翡翠のような輝きを放つカワセミ。非常に暗い環境でしたが、レンズの明るさに助けられ見事に色を引き出せました。",
        gear: "SONY α9 III / FE 400mm F2.8 GM OSS"
    },
    {
        areaId: "shibuya",
        areaTitle: "Shibuya City",
        areaLocation: "Meiji Jingu Forest",
        lat: 35.6619,
        lng: 139.7040,
        title: "11 — Morning Chorus",
        imgThumb: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=800&auto=format&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1600&auto=format&fit=crop",
        author: "Kenji.S",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
        comment: "早朝の冷たい空気の中、森に響き渡る透き通った鳴き声。声の主を探し当て、逆光気味にふんわりと描写しました。",
        gear: "Canon EOS R5 / EF 500mm F4L IS II USM"
    },
    {
        areaId: "hachioji",
        areaTitle: "Hachioji City",
        areaLocation: "Mount Takao",
        lat: 35.6558, // 八王子市の基準座標に統一
        lng: 139.3239,
        title: "12 — Hovering Magic",
        imgThumb: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?q=80&w=800&auto=format&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?q=80&w=1600&auto=format&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "空中で静止し、懸命に羽ばたく小さな鳥。高尾の豊かな自然が育む、まるで魔法のような奇跡の一枚です。",
        gear: "SONY α1 / FE 600mm F4 GM OSS"
    },
    {
        areaId: "okutama",
        areaTitle: "Okutama Town",
        areaLocation: "Lake Okutama",
        lat: 35.8087, // 奥多摩町の基準座標に統一
        lng: 139.0988,
        title: "13 — The Sovereign",
        imgThumb: "https://images.unsplash.com/photo-1515865644861-8bedc4fb8344?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1515865644861-8bedc4fb8344?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Daiki.M",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
        comment: "奥多摩湖の上空を悠然と旋回する猛禽類。大自然の王者たる風格と、眼下の獲物を探す鋭い眼差しに圧倒されました。",
        gear: "Nikon Z9 / NIKKOR Z 400mm f/2.8 TC VR S"
    },
    {
        areaId: "shinjuku",
        areaTitle: "Shinjuku City",
        areaLocation: "Shinjuku Gyoen",
        lat: 35.6938,
        lng: 139.7034,
        title: "14 — Hidden Beauty",
        imgThumb: "https://images.unsplash.com/photo-1615567311975-eb3e97ceaeee?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1615567311975-eb3e97ceaeee?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Kenji.S",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
        comment: "都心の庭園にも、よく見ると美しく力強い野鳥たちが息づいています。深い緑色とのコントラストが気に入っています。",
        gear: "Canon EOS R3 / RF100-500mm F4.5-7.1 L IS USM"
    },
    {
        areaId: "taito",
        areaTitle: "Taito City",
        areaLocation: "Shinobazu Pond",
        lat: 35.7126,
        lng: 139.7802,
        title: "15 — Reflection",
        imgThumb: "https://images.unsplash.com/photo-1489513963600-afa31b458fec?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1489513963600-afa31b458fec?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Yuki.K",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        comment: "不忍池の静かな水面に映るシルエット。シンメトリーな構図を意識し、絵画のような幾何学的な美しさを狙いました。",
        gear: "SONY α9 III / FE 400mm F2.8 GM OSS"
    },
    {
        areaId: "musashino",
        areaTitle: "Musashino City",
        areaLocation: "Inokashira Park",
        lat: 35.7009,
        lng: 139.5750,
        title: "16 — Autumn Colors",
        imgThumb: "https://images.unsplash.com/photo-1573739711422-68a9d0aa7d6b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        imgFull: "https://images.unsplash.com/photo-1573739711422-68a9d0aa7d6b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop",
        author: "Daiki.M",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
        comment: "色づく秋の葉の中で羽を休める姿。季節の移ろいを感じさせる、暖かみのある色合いに現像で仕上げています。",
        gear: "Nikon Z8 / NIKKOR Z 600mm f/4 TC VR S"
    }
];