// --- script.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. ギャラリーの動的生成 (data.jsを利用)
    // =========================================
    const galleryContainer = document.getElementById('gallery-container');
    
    // data.js の galleryData を回してHTMLを生成
    galleryData.forEach(data => {
        const item = document.createElement('div');
        item.className = 'reveal-wrap gallery-item lb-trigger';
        // Lightboxやフィルタリング用のデータ属性を付与
        item.dataset.area = data.areaId;
        item.dataset.img = data.imgFull;
        item.dataset.title = data.title;
        item.dataset.author = data.author;
        item.dataset.avatar = data.avatar;
        item.dataset.location = data.areaLocation;
        item.dataset.comment = data.comment;
        item.dataset.gear = data.gear;

        item.innerHTML = `
            <div class="reveal-mask"></div>
            <img src="${data.imgThumb}" alt="${data.title}">
            <div class="image-caption">
                <div class="caption-title">${data.title}</div>
                <div class="card-meta">
                    <img src="${data.avatar}" class="author-avatar" alt="">
                    <div class="meta-text">
                        <span class="author-name">${data.author}</span>
                        <span class="shoot-area">📍 ${data.areaLocation}</span>
                    </div>
                </div>
            </div>
        `;
        galleryContainer.appendChild(item);
    });

    // =========================================
    // 2. GSAP 初期アニメーション設定
    // =========================================
    gsap.registerPlugin(ScrollTrigger);
    
    // 右カラムのテキストフェードイン
    const tl = gsap.timeline();
    tl.to(".divider", { width: "100%", duration: 1.5, ease: "power3.inOut" }, 0.2);
    tl.fromTo(".logo, .hamburger, .split-text, .fade-text", 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power2.out" }, 
        0.5
    );

    // ギャラリー写真のReveal(幕開け)アニメーション
    const revealWraps = document.querySelectorAll('.reveal-wrap');
    revealWraps.forEach(wrap => {
        const mask = wrap.querySelector('.reveal-mask');
        const img = wrap.querySelector(':scope > img');
        const scrollTl = gsap.timeline({ 
            scrollTrigger: { trigger: wrap, start: "top 85%", toggleActions: "play none none none" } 
        });
        scrollTl.to(mask, { scaleY: 0, duration: 1.2, ease: "power3.inOut" }, 0);
        if(img) scrollTl.to(img, { scale: 1, duration: 1.5, ease: "power3.out" }, 0.2);
    });

    // =========================================
    // 3. ギャラリー <-> マップ の切り替えロジック
    // =========================================
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const viewSections = document.querySelectorAll('.view-section');
    let mapInitialized = false;

    function switchView(targetId) {
        toggleBtns.forEach(b => b.classList.remove('is-active'));
        document.querySelector(`[data-target="${targetId}"]`).classList.add('is-active');
        
        viewSections.forEach(section => {
            section.classList.remove('is-active');
            if(section.id === targetId) section.classList.add('is-active');
        });
        
        ScrollTrigger.refresh(); // レイアウト崩れ防止
        
        // 初回のみ地図を描画
        if(targetId === 'view-area' && !mapInitialized) {
            initMap(); 
            mapInitialized = true;
        }
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.getAttribute('data-target')));
    });

    // =========================================
    // 4. 地図(Leaflet)の生成
    // =========================================
    let birdMapInstance = null; // ★追加：マップインスタンスを保持する変数

    function initMap() {
        // ★変更：const map を birdMapInstance に変更
        birdMapInstance = L.map('bird-map', {
            center: [35.6895, 139.6917], zoom: 11, minZoom: 10, maxZoom: 15,
            zoomControl: false, scrollWheelZoom: false, touchZoom: false, 
            doubleClickZoom: false, boxZoom: false, keyboard: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        }).addTo(birdMapInstance); // ★変更：map を birdMapInstance に変更

        // galleryData から、同じ緯度経度(同じ場所)の写真をグループ化する
        const locationsMap = {};
        galleryData.forEach(item => {
            const key = `${item.lat},${item.lng}`;
            if (!locationsMap[key]) {
                locationsMap[key] = {
                    id: item.areaId,
                    title: item.areaTitle,
                    lat: item.lat,
                    lng: item.lng,
                    birds: []
                };
            }
            locationsMap[key].birds.push(item);
        });

        // オブジェクトを配列に変換してマーカーを配置
        Object.values(locationsMap).forEach(loc => {
            const birdCount = loc.birds.length;
            const coverImage = loc.birds[0].imgThumb;
            const badgeHtml = birdCount > 1 ? `<div class="echo-count">${birdCount}</div>` : '';
            const swipeHintHtml = birdCount > 1 ? `<span class="swipe-hint">Swipe ➔</span>` : '';

            const echoIcon = L.divIcon({
                className: 'custom-echo-icon',
                html: `<div class="echo-marker"><div class="echo-pulse"></div><div class="echo-core" style="background-image: url('${coverImage}');">${badgeHtml}</div></div>`,
                iconSize: [80, 80], iconAnchor: [40, 40], popupAnchor: [0, -25]
            });

            let popupHtml = `<div class="custom-popup"><div class="popup-header"><p>📍 Area: ${loc.title}</p>${swipeHintHtml}</div><div class="popup-slider">`;
            
            loc.birds.forEach(bird => {
                popupHtml += `
                    <div class="popup-item lb-trigger" 
                         data-img="${bird.imgFull}" data-title="${bird.title}" data-author="${bird.author}" 
                         data-avatar="${bird.avatar}" data-location="${bird.areaLocation}" 
                         data-comment="${bird.comment}" data-gear="${bird.gear}">
                        <img src="${bird.imgThumb}" alt="${bird.title}">
                        <div class="popup-overlay">
                            <h3>${bird.title}</h3>
                            <div class="card-meta popup-meta">
                                <img src="${bird.avatar}" class="author-avatar" alt="">
                                <div class="meta-text"><span class="author-name">${bird.author}</span></div>
                            </div>
                        </div>
                    </div>
                `;
            });
            popupHtml += `</div><button class="filter-cta-btn" data-filter-id="${loc.id}" data-filter-name="${loc.title}">View Gallery</button></div>`;
            
            L.marker([loc.lat, loc.lng], { icon: echoIcon }).addTo(birdMapInstance).bindPopup(popupHtml);
        });
    }

    // =========================================
    // 5. Lightbox (画像拡大 & ナビゲーション)
    // =========================================
    const lightbox = document.getElementById('lightbox');
    const lbCloseBtn = document.getElementById('lightbox-close-btn');
    const lbCloseBg = document.getElementById('lightbox-close-bg');
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    
    let currentLightboxGroup = [];
    let currentLightboxIndex = 0;

    function openLightbox(trigger) {
        // 同じコンテナ内にある表示中（display:noneでない）の画像を取得
        const container = trigger.closest('.gallery-masonry, .popup-slider');
        if (container) {
            currentLightboxGroup = Array.from(container.querySelectorAll('.lb-trigger')).filter(el => el.offsetParent !== null);
            currentLightboxIndex = currentLightboxGroup.indexOf(trigger);
        } else {
            currentLightboxGroup = [trigger];
            currentLightboxIndex = 0;
        }

        // 画像が1枚だけなら左右矢印を消す
        const navBtns = document.querySelectorAll('.lb-nav-btn');
        if (currentLightboxGroup.length <= 1) {
            navBtns.forEach(btn => btn.style.display = 'none');
        } else {
            navBtns.forEach(btn => btn.style.display = 'flex');
        }

        updateLightboxContent(trigger);
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    // 中身の更新（GSAPでフワッと切り替え）
    function updateLightboxContent(trigger) {
        const lbImg = document.getElementById('lb-img');
        const lbInfoInner = document.getElementById('lb-info-inner');
        
        gsap.to([lbImg, lbInfoInner], {opacity: 0, duration: 0.2, ease: "power2.inOut", onComplete: () => {
            lbImg.src = trigger.getAttribute('data-img');
            document.getElementById('lb-title').innerText = trigger.getAttribute('data-title');
            document.getElementById('lb-author').innerText = trigger.getAttribute('data-author');
            document.getElementById('lb-avatar').src = trigger.getAttribute('data-avatar');
            document.getElementById('lb-location').innerText = '📍 ' + trigger.getAttribute('data-location');
            document.getElementById('lb-comment').innerText = trigger.getAttribute('data-comment');
            document.getElementById('lb-gear').innerText = trigger.getAttribute('data-gear');
            
            // リアクションボタンのリセット
            reactionBtns.forEach(btn => {
                btn.classList.remove('is-reacted');
                btn.querySelector('.count').innerText = Math.floor(Math.random() * 40) + 1; // デモ用
            });

            gsap.to([lbImg, lbInfoInner], {opacity: 1, duration: 0.3, ease: "power2.out"});
        }});
    }

    function navigateLightbox(direction) {
        if (currentLightboxGroup.length <= 1) return;
        
        currentLightboxIndex += direction;
        // ループ処理
        if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxGroup.length - 1;
        if (currentLightboxIndex >= currentLightboxGroup.length) currentLightboxIndex = 0;
        
        updateLightboxContent(currentLightboxGroup[currentLightboxIndex]);
    }

    // イベントリスナー
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('.lb-trigger');
        if (trigger) openLightbox(trigger);
    });

    document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-active')) return;
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
    }
    lbCloseBtn.addEventListener('click', closeLightbox);
    lbCloseBg.addEventListener('click', closeLightbox);

    reactionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('.count');
            let count = parseInt(countSpan.innerText);
            if (btn.classList.contains('is-reacted')) {
                btn.classList.remove('is-reacted');
                countSpan.innerText = count - 1;
            } else {
                gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
                btn.classList.add('is-reacted');
                countSpan.innerText = count + 1;
            }
        });
    });

    // =========================================
    // 6. エリア絞り込み機能 (CTA)
    // =========================================
    const filterNotice = document.getElementById('filter-notice');
    const filterAreaName = document.getElementById('filter-area-name');
    const clearFilterBtn = document.getElementById('clear-filter-btn');
    const galleryItems = document.getElementsByClassName('gallery-item'); // 動的生成後なので生HTML要素を取得

    document.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('filter-cta-btn')) {
            const areaId = e.target.getAttribute('data-filter-id');
            const areaName = e.target.getAttribute('data-filter-name');
            
            switchView('view-gallery');
            filterAreaName.innerText = areaName;
            filterNotice.classList.add('is-active');

            Array.from(galleryItems).forEach(item => {
                if(item.getAttribute('data-area') === areaId) {
                    item.style.display = 'block';
                    gsap.fromTo(item, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"});
                } else { 
                    item.style.display = 'none'; 
                }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            ScrollTrigger.refresh();
        }
    });

    clearFilterBtn.addEventListener('click', () => {
        filterNotice.classList.remove('is-active');
        Array.from(galleryItems).forEach(item => {
            item.style.display = 'block';
            gsap.fromTo(item, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"});
        });
        ScrollTrigger.refresh();
    });

    // =========================================
    // 7. ハンバーガーメニュー
    // =========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    function toggleMenu() {
        hamburgerBtn.classList.toggle('is-active');
        menuOverlay.classList.toggle('is-active');
        if (window.innerWidth <= 1024) {
            document.body.style.overflow = menuOverlay.classList.contains('is-active') ? 'hidden' : '';
        }
    }
    hamburgerBtn.addEventListener('click', toggleMenu);
    menuLinks.forEach(l => l.addEventListener('click', () => { if(menuOverlay.classList.contains('is-active')) toggleMenu(); }));

    // =========================================
    // 8. フォーカスモード (右カラム折りたたみ) ＆ 状態保存
    // =========================================
    const mainLayout = document.querySelector('.split-layout');
    const focusToggleBtn = document.getElementById('focus-toggle-btn');
    
    if (mainLayout && focusToggleBtn) {
        // 1. localStorageから前回の状態を読み込み（マイページと状態を共有します）
        const isFocused = localStorage.getItem('aves_focus_mode') === 'true';
        if (isFocused) {
            mainLayout.classList.add('is-focused');
        }

        // 2. ボタンクリック時の処理
        focusToggleBtn.addEventListener('click', () => {
            const willBeFocused = !mainLayout.classList.contains('is-focused');
            mainLayout.classList.toggle('is-focused');
            localStorage.setItem('aves_focus_mode', willBeFocused);
            
            setTimeout(() => {
                ScrollTrigger.refresh();
                // ★追加：Leafletに直接「サイズを再計算して！」と命令する
                if (birdMapInstance) {
                    birdMapInstance.invalidateSize();
                }
                window.dispatchEvent(new Event('resize'));
            }, 500); 
        });
    }
});