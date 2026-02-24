// --- mypage.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. マイギャラリーの動的生成
    const myGalleryContainer = document.getElementById('my-gallery-container');
    const myPhotos = galleryData.filter(data => data.author === "Yuki.K");

    // mypage.js の 1.マイギャラリーの動的生成 部分を以下のように修正

    myPhotos.forEach((data, index) => {
        // デモ用：インデックスが奇数のものを仮想的に「非公開(Private)」として扱う
        const visibility = (index % 2 !== 0) ? 'private' : 'public';
        
        const item = document.createElement('div');
        item.className = 'reveal-wrap gallery-item';
        item.dataset.area = data.areaId;
        item.dataset.visibility = visibility;
        // その他のデータ属性
        item.dataset.img = data.imgFull;
        item.dataset.title = data.title;
        item.dataset.author = data.author;
        item.dataset.avatar = data.avatar;
        item.dataset.location = data.areaLocation;
        item.dataset.comment = data.comment;
        item.dataset.gear = data.gear;

        // ▼ privateBadgeHtml の生成と挿入を削除しました ▼
        item.innerHTML = `
            <div class="reveal-mask"></div>
            <img src="${data.imgThumb}" alt="${data.title}">
            <div class="image-caption">
                <div class="caption-title">${data.title}</div>
                <div class="card-meta mypage-meta">
                    <span class="shoot-area">📍 ${data.areaLocation}</span>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button class="action-btn btn-delete" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        myGalleryContainer.appendChild(item);
    });

    // ▼ 変更：公開/非公開/すべての3軸フィルタリングロジック ▼
    const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
    const allGalleryItems = document.querySelectorAll('#my-gallery-container .gallery-item');

    // 初期化：最初は「すべて (all)」タブがアクティブなので、全件表示状態にします。
    allGalleryItems.forEach(item => {
        item.style.display = 'block';
    });

    galleryTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブなタブの切り替え
            galleryTabBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const targetVisibility = btn.getAttribute('data-filter');

            allGalleryItems.forEach(item => {
                // targetVisibility が 'all' の場合、または data-visibility が一致する場合に表示
                if (targetVisibility === 'all' || item.getAttribute('data-visibility') === targetVisibility) {
                    item.style.display = 'block';
                    // GSAPを使った滑らかなソートアニメーション
                    gsap.fromTo(item, 
                        { opacity: 0, scale: 0.95, y: 15 }, 
                        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Masonryレイアウトやスクロールトリガーの再計算
            ScrollTrigger.refresh();
        });
    });


    // =========================================
    // 新規追加：レビュー待ちギャラリーの生成と制御
    // =========================================
    const reviewGalleryContainer = document.getElementById('review-gallery-container');

    // デモ用：galleryDataからランダムに数枚ピックアップして「他の人の仮投稿」として表示
    const reviewPhotos = galleryData.slice(3, 8); 

    reviewPhotos.forEach(data => {
        const item = document.createElement('div');
        // クラスに review-trigger を付与し、通常のlb-triggerとは分ける
        item.className = 'reveal-wrap gallery-item lb-trigger review-trigger';
        item.dataset.img = data.imgFull;
        // タイトルの前半の数字（01 — など）を消して鳥の名前だけを抽出する簡易ロジック
        const birdName = data.title.split('— ')[1] || data.title;
        item.dataset.birdName = birdName;

        // ご要望通り、ホバー時の .image-caption は意図的に除外
        item.innerHTML = `
            <div class="reveal-mask"></div>
            <img src="${data.imgThumb}" alt="Review Request">
        `;
        reviewGalleryContainer.appendChild(item);
    });


    // =========================================
    // Lightbox (通常 ＆ Review 兼用)
    // =========================================
    const lightbox = document.getElementById('lightbox');
    const lbCloseBtn = document.getElementById('lightbox-close-btn');
    const lbCloseBg = document.getElementById('lightbox-close-bg');
    let currentLightboxGroup = [];
    let currentLightboxIndex = 0;
    let currentSelectedVoteType = null; // 投票の選択状態

    function openLightbox(trigger) {
        const container = trigger.closest('.gallery-masonry, .popup-slider');
        if (container) {
            currentLightboxGroup = Array.from(container.querySelectorAll('.lb-trigger')).filter(el => el.offsetParent !== null);
            currentLightboxIndex = currentLightboxGroup.indexOf(trigger);
        } else {
            currentLightboxGroup = [trigger];
            currentLightboxIndex = 0;
        }

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

    function updateLightboxContent(trigger) {
        const lbImg = document.getElementById('lb-img');
        const lbInfoInner = document.getElementById('lb-info-inner');
        const lbReviewInner = document.getElementById('lb-review-inner');
        const isReview = trigger.classList.contains('review-trigger');
        
        gsap.to([lbImg, lbInfoInner, lbReviewInner], {opacity: 0, duration: 0.2, ease: "power2.inOut", onComplete: () => {
            lbImg.src = trigger.getAttribute('data-img');
            
            if (isReview) {
                // === Reviewモード ===
                lbInfoInner.style.display = 'none';
                lbReviewInner.style.display = 'block';
                
                const birdName = trigger.dataset.birdName;
                document.getElementById('lb-review-title').innerText = `この鳥は「${birdName}」ですか？`;
                
                // フォームのリセット
                document.querySelectorAll('#lb-review-inner .btn-vote').forEach(b => b.classList.remove('is-selected'));
                document.getElementById('review-comment').value = '';
                currentSelectedVoteType = null;
                
                gsap.to([lbImg, lbReviewInner], {opacity: 1, duration: 0.3, ease: "power2.out"});
            } else {
                // === 通常ギャラリーモード ===
                lbInfoInner.style.display = 'block';
                lbReviewInner.style.display = 'none';
                
                document.getElementById('lb-title').innerText = trigger.getAttribute('data-title');
                document.getElementById('lb-author').innerText = trigger.getAttribute('data-author');
                document.getElementById('lb-avatar').src = trigger.getAttribute('data-avatar');
                document.getElementById('lb-location').innerText = '📍 ' + trigger.getAttribute('data-location');
                document.getElementById('lb-comment').innerText = trigger.getAttribute('data-comment');
                document.getElementById('lb-gear').innerText = trigger.getAttribute('data-gear');
                
                gsap.to([lbImg, lbInfoInner], {opacity: 1, duration: 0.3, ease: "power2.out"});
            }
        }});
    }

    function navigateLightbox(direction) {
        if (currentLightboxGroup.length <= 1) return;
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxGroup.length - 1;
        if (currentLightboxIndex >= currentLightboxGroup.length) currentLightboxIndex = 0;
        updateLightboxContent(currentLightboxGroup[currentLightboxIndex]);
    }

    // イベントリスナー群
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('.lb-trigger');
        // MyPageでは「編集・削除」ボタンのクリックと競合しないようにする
        if (trigger && !e.target.closest('.action-btn')) openLightbox(trigger);
    });

    document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
    }
    lbCloseBtn.addEventListener('click', closeLightbox);
    lbCloseBg.addEventListener('click', closeLightbox);

    // === Review用の投票と送信ロジック ===
    window.selectReviewVote = function(type, btnElement) {
        document.querySelectorAll('#lb-review-inner .btn-vote').forEach(b => b.classList.remove('is-selected'));
        btnElement.classList.add('is-selected');
        currentSelectedVoteType = type;
    };

    window.submitReviewVote = function() {
        if (!currentSelectedVoteType) {
            alert("評価（あっている/間違っている/評価が難しい）を選択してください。");
            return;
        }
        closeLightbox();
        showToast("レビューを送信しました。ご協力ありがとうございます！");
    };


    // =========================================
    // 修正：公開設定トグルのテキスト切り替えロジック（New Post / Quest Post両対応）
    // =========================================
    function setupVisibilityToggle(toggleId, labelId) {
        const toggle = document.getElementById(toggleId);
        const label = document.getElementById(labelId);
        if (toggle && label) {
            toggle.addEventListener('change', function() {
                if (this.checked) {
                    label.innerText = '共有 (投稿チェックに進む)';
                    label.style.color = 'var(--text-main)';
                } else {
                    label.innerText = '自分だけ (Private)';
                    label.style.color = 'var(--text-muted)';
                }
            });
        }
    }
    setupVisibilityToggle('new-post-visibility', 'new-visibility-label');
    setupVisibilityToggle('quest-post-visibility', 'quest-visibility-label');

    // 2. GSAP 初期アニメーション
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    tl.fromTo(".info-inner > div", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" });

    const revealWraps = document.querySelectorAll('.reveal-wrap');
    revealWraps.forEach(wrap => {
        const mask = wrap.querySelector('.reveal-mask');
        const img = wrap.querySelector(':scope > img');
        const scrollTl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: "top 90%", toggleActions: "play none none none" } });
        scrollTl.to(mask, { scaleY: 0, duration: 1.2, ease: "power3.inOut" }, 0);
        if(img) scrollTl.to(img, { scale: 1, duration: 1.5, ease: "power3.out" }, 0.2);
    });

    // 3. ギャラリー <-> マップ 切り替えと地図の生成
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const viewSections = document.querySelectorAll('.view-section');
    let mapInitialized = false;
    let birdMapInstance = null; // ★追加

    // mypage.js の switchView 関数内を以下のように調整するとより堅牢です
    function switchView(targetId) {
        toggleBtns.forEach(b => b.classList.remove('is-active'));
        document.querySelector(`.toggle-btn[data-target="${targetId}"]`).classList.add('is-active');
        
        viewSections.forEach(section => {
            section.classList.remove('is-active');
            if(section.id === targetId) section.classList.add('is-active');
        });

        // ▼ スマホ対応：フローティングナビが押されたら、上部のタブも強制的に「ギャラリー」にする ▼
        if (window.innerWidth <= 1024) {
            const galleryTabBtn = document.querySelector('.mypage-tab-btn[data-tab="tab-gallery"]');
            if (galleryTabBtn && !galleryTabBtn.classList.contains('is-active')) {
                // 強制的にギャラリータブへ切り替え
                document.querySelectorAll('.mypage-tab-btn').forEach(b => b.classList.remove('is-active'));
                galleryTabBtn.classList.add('is-active');
                document.body.setAttribute('data-active-sp-tab', 'tab-gallery');
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('is-active'));
            }
        }
        
        setTimeout(() => {
            ScrollTrigger.refresh(); 
            if(targetId === 'view-area') {
                if (!mapInitialized) {
                    initMap(); 
                    mapInitialized = true;
                } else if (typeof birdMapInstance !== 'undefined' && birdMapInstance) {
                    birdMapInstance.invalidateSize();
                }
            }
        }, 100);
    }
    toggleBtns.forEach(btn => { btn.addEventListener('click', () => switchView(btn.getAttribute('data-target'))); });

    function initMap() {
        birdMapInstance = L.map('bird-map', { center: [35.6895, 139.6917], zoom: 11, minZoom: 10, maxZoom: 15, zoomControl: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' }).addTo(birdMapInstance); // ★変更
        const locationsMap = {};
        myPhotos.forEach(item => {
            const key = `${item.lat},${item.lng}`;
            if (!locationsMap[key]) { locationsMap[key] = { id: item.areaId, title: item.areaTitle, lat: item.lat, lng: item.lng, birds: [] }; }
            locationsMap[key].birds.push(item);
        });

        Object.values(locationsMap).forEach(loc => {
            const birdCount = loc.birds.length;
            const coverImage = loc.birds[0].imgThumb;
            const badgeHtml = birdCount > 1 ? `<div class="echo-count">${birdCount}</div>` : '';
            const swipeHintHtml = birdCount > 1 ? `<span class="swipe-hint">Swipe ➔</span>` : '';

            const echoIcon = L.divIcon({ className: 'custom-echo-icon', html: `<div class="echo-marker"><div class="echo-pulse"></div><div class="echo-core" style="background-image: url('${coverImage}');">${badgeHtml}</div></div>`, iconSize: [80, 80], iconAnchor: [40, 40], popupAnchor: [0, -25] });
            let popupHtml = `<div class="custom-popup"><div class="popup-header"><p>📍 Area: ${loc.title}</p>${swipeHintHtml}</div><div class="popup-slider">`;
            
            loc.birds.forEach(bird => {
                // ▼ 改修：地図のポップアップ内からも lb-trigger を削除 ▼
                popupHtml += `<div class="popup-item" data-img="${bird.imgFull}" data-title="${bird.title}" data-author="${bird.author}" data-avatar="${bird.avatar}" data-location="${bird.areaLocation}" data-comment="${bird.comment}" data-gear="${bird.gear}"><img src="${bird.imgThumb}" alt="${bird.title}"><div class="popup-overlay"><h3>${bird.title}</h3><div class="card-meta popup-meta"><img src="${bird.avatar}" class="author-avatar" alt=""><div class="meta-text"><span class="author-name">${bird.author}</span></div></div></div></div>`;
            });
            popupHtml += `</div><button class="filter-cta-btn" data-filter-id="${loc.id}" data-filter-name="${loc.title}">Filter My Gallery</button></div>`;
            L.marker([loc.lat, loc.lng], { icon: echoIcon }).addTo(birdMapInstance).bindPopup(popupHtml);
        });
    }

    // エリア絞り込み機能
    const filterNotice = document.getElementById('filter-notice');
    const filterAreaName = document.getElementById('filter-area-name');
    const clearFilterBtn = document.getElementById('clear-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    document.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('filter-cta-btn')) {
            const areaId = e.target.getAttribute('data-filter-id');
            const areaName = e.target.getAttribute('data-filter-name');
            switchView('view-gallery');
            filterAreaName.innerText = areaName;
            filterNotice.classList.add('is-active');

            galleryItems.forEach(item => {
                if(item.getAttribute('data-area') === areaId) {
                    item.style.display = 'block';
                    gsap.fromTo(item, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"});
                } else { item.style.display = 'none'; }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            ScrollTrigger.refresh();
        }
    });

    clearFilterBtn.addEventListener('click', () => {
        filterNotice.classList.remove('is-active');
        galleryItems.forEach(item => {
            item.style.display = 'block';
            gsap.fromTo(item, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"});
        });
        ScrollTrigger.refresh();
    });

    // タブ切り替えとトースト通知
    // =========================================
    // タブ切り替え (SPAライクな制御)
    // =========================================
    const tabBtns = document.querySelectorAll('.mypage-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 初期状態：Profileを開いている状態にする
    document.body.setAttribute('data-active-sp-tab', 'tab-profile');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // すべてのタブのアクティブ状態を解除
            tabBtns.forEach(b => b.classList.remove('is-active'));
            tabContents.forEach(c => c.classList.remove('is-active'));
            
            // 選択したタブをアクティブにする
            btn.classList.add('is-active');
            document.body.setAttribute('data-active-sp-tab', targetTab); // CSSに状態を伝達
            
            // ギャラリー以外の場合は、対応するコンテンツを表示
            if(targetTab !== 'tab-gallery') {
                document.getElementById(targetTab).classList.add('is-active');
            }
            
            // レイアウト再計算（画面が切り替わった直後のガタつきを防止）
            setTimeout(() => {
                ScrollTrigger.refresh();
                if (birdMapInstance && targetTab === 'tab-gallery') {
                    birdMapInstance.invalidateSize();
                }
            }, 100);
        });
    });

    window.showToast = function(message) {
        const toast = document.getElementById('toast');
        if(message) toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }



    // =========================================
    // 編集＆削除 モーダルロジック
    // =========================================
    let currentEditItem = null;
    let currentDeleteItem = null;

    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');
        
        if (editBtn) {
            currentEditItem = editBtn.closest('.gallery-item');
            
            // データをフォームにセット
            document.getElementById('edit-title').value = currentEditItem.dataset.title;
            document.getElementById('edit-location').value = currentEditItem.dataset.location;
            document.getElementById('edit-comment').value = currentEditItem.dataset.comment;
            
            // ▼ 追加：現在の画像をプレビューにセットし、ファイル選択の状態をリセット ▼
            document.getElementById('edit-current-img').src = currentEditItem.querySelector(':scope > img').src;
            document.getElementById('edit-image-preview').dataset.newImg = ""; 
            document.getElementById('edit-image-input').value = "";
            
            document.getElementById('edit-modal').classList.add('is-active');
        }
        
        if (deleteBtn) {
            currentDeleteItem = deleteBtn.closest('.gallery-item');
            document.getElementById('delete-modal').classList.add('is-active');
        }
    });

    // ▼ 追加：プレビュー領域クリックでファイル選択ダイアログを開く ▼
    document.getElementById('edit-image-preview').addEventListener('click', () => {
        document.getElementById('edit-image-input').click();
    });

    // ▼ 追加：ファイルが選択されたらプレビュー画像を差し替える処理（擬似ローカル処理） ▼
    document.getElementById('edit-image-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                // 読み込んだ画像をプレビューに反映し、一時的に保持する
                document.getElementById('edit-current-img').src = evt.target.result;
                document.getElementById('edit-image-preview').dataset.newImg = evt.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // ▼ 変更：new-post-modal を閉じる処理を追加 ▼
    const closeModals = () => {
        document.getElementById('edit-modal').classList.remove('is-active');
        document.getElementById('delete-modal').classList.remove('is-active');
        
        // これを追加
        const newPostModalEl = document.getElementById('new-post-modal');
        if (newPostModalEl) newPostModalEl.classList.remove('is-active');
        
        currentEditItem = null;
        currentDeleteItem = null;
    };
    
    document.getElementById('edit-close-btn').addEventListener('click', closeModals);
    document.getElementById('delete-cancel-btn').addEventListener('click', closeModals);
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeModals();
        });
    });

    window.submitEdit = function() {
        if (currentEditItem) {
            const newTitle = document.getElementById('edit-title').value;
            const newLocation = document.getElementById('edit-location').value;
            const newComment = document.getElementById('edit-comment').value;
            const newImgSrc = document.getElementById('edit-image-preview').dataset.newImg;

            // data属性の更新
            currentEditItem.dataset.title = newTitle;
            currentEditItem.dataset.location = newLocation;
            currentEditItem.dataset.comment = newComment;

            // テキストの見た目の更新
            currentEditItem.querySelector('.caption-title').innerText = newTitle;
            currentEditItem.querySelector('.shoot-area').innerText = '📍 ' + newLocation;
            
            // ▼ 追加：新しい画像が選択されていれば、ギャラリー上の画像も差し替える ▼
            if (newImgSrc) {
                currentEditItem.dataset.img = newImgSrc; // 拡大時のフル画像データも更新
                currentEditItem.querySelector(':scope > img').src = newImgSrc;
            }
            
            closeModals();
            showToast("Post Updated Successfully!");
        }
    };

    document.getElementById('delete-confirm-btn').addEventListener('click', function() {
        if (currentDeleteItem) {
            gsap.to(currentDeleteItem, {
                opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in", 
                onComplete: () => {
                    currentDeleteItem.remove();
                    ScrollTrigger.refresh();
                }
            });
            closeModals();
            showToast("Post Deleted.");
        }
    });

    // =========================================
    // クエスト(Field Quests)の動的生成 & バナー制御
    // =========================================
    function initQuests() {
        const questContainer = document.getElementById('quest-list-container');
        
        // プログレスバー（バナー用とオーバーレイ用の2箇所）
        const progressBars = [document.getElementById('quest-progress-bar'), document.getElementById('banner-progress-bar')];
        const progressTexts = [document.getElementById('quest-progress-text'), document.getElementById('banner-progress-text')];
        
        if (!questContainer || typeof questData === 'undefined') return;

        let discoveredCount = 0;
        const totalCount = questData.quests.length;

        const birdIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>`;
        const photoPlaceholderSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;

        // カードの生成
        questData.quests.forEach((quest) => {
            if (quest.isDiscovered) discoveredCount++;
            const isDiscoveredClass = quest.isDiscovered ? 'is-discovered' : '';
            const diffClass = quest.difficulty === '見つけたい' ? 'rare' : 'common';
            const photoContent = quest.isDiscovered 
                ? `<img src="${quest.discoveredImg}" alt="${quest.name}">`
                : `<div class="quest-placeholder">${photoPlaceholderSVG}</div>`;

            const cardHTML = `
                <div class="quest-card ${isDiscoveredClass}" id="card-${quest.id}">
                    <div class="quest-header">
                        <div class="quest-icon">${birdIconSVG}</div>
                        <div class="quest-title-wrap">
                            <h3 class="quest-name">${quest.name}</h3>
                            <span class="quest-env">環境：${quest.environment}</span>
                        </div>
                        <div class="quest-difficulty ${diffClass}">${quest.difficulty}</div>
                    </div>
                    <div class="quest-photo-frame">${photoContent}</div>
                    <div class="quest-body">
                        <div class="quest-status-badges">
                            <span class="badge-status quest-status-text">${quest.isDiscovered ? '発見済' : '未発見'}</span>
                        </div>
                        <ul class="quest-hints">
                            ${quest.hints.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                        <button class="btn-quest-log quest-action-btn" ${quest.isDiscovered ? 'disabled' : ''} onclick="openQuestPostModal('${quest.id}', '${quest.name}')">
                            ${quest.isDiscovered ? '投稿済み' : 'この鳥の写真を投稿'}
                        </button>
                    </div>
                </div>
            `;
            questContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // 共通関数：プログレスバーの更新
        window.updateQuestProgress = function() {
            const currentDiscovered = questData.quests.filter(q => q.isDiscovered).length;
            const percentage = (currentDiscovered / totalCount) * 100;
            
            progressBars.forEach(bar => { if(bar) bar.style.width = `${percentage}%`; });
            progressTexts.forEach(text => { if(text) text.innerText = `${currentDiscovered} / ${totalCount} DISCOVERED`; });
        };
        
        // 初回計算
        window.updateQuestProgress();
    }

    // ページロード時にクエストリストを裏側で生成しておく
    initQuests();

    // ▼ 追加：バナークリックで全画面オーバーレイをスライドイン ▼
    document.getElementById('quest-banner-btn').addEventListener('click', () => {
        document.getElementById('quest-overlay').classList.add('is-active');
        document.body.style.overflow = 'hidden'; // 背面のスクロールを止める
    });

    // ▼ 追加：オーバーレイを閉じる ▼
    document.getElementById('quest-overlay-close').addEventListener('click', () => {
        document.getElementById('quest-overlay').classList.remove('is-active');
        document.body.style.overflow = '';
    });
    // =========================================
    // クエスト投稿モーダルのロジック
    // =========================================
    
    // モーダルを開く関数（HTMLから呼ばれる）
    window.openQuestPostModal = function(questId, birdName) {
        document.getElementById('quest-target-id').value = questId;
        // UX提案：タイトルに鳥の名前を入れてコンテキストを明確に
        document.getElementById('quest-post-modal-title').innerText = `${birdName} の写真を投稿`;
        
        // フォームのリセット
        document.getElementById('form-quest-post').reset();
        document.getElementById('quest-current-img').style.display = 'none';
        document.getElementById('quest-image-overlay').style.display = 'flex';
        document.getElementById('quest-image-preview').dataset.newImg = "";
        
        document.getElementById('quest-post-modal').classList.add('is-active');
    };

    // モーダルを閉じる処理
    document.getElementById('quest-post-close-btn').addEventListener('click', () => {
        document.getElementById('quest-post-modal').classList.remove('is-active');
    });

    // 画像選択（プレビュー）の処理
    document.getElementById('quest-image-preview').addEventListener('click', () => {
        document.getElementById('quest-image-input').click();
    });

    document.getElementById('quest-image-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                const imgSrc = evt.target.result;
                const imgEl = document.getElementById('quest-current-img');
                imgEl.src = imgSrc;
                imgEl.style.display = 'block';
                document.getElementById('quest-image-overlay').style.display = 'none';
                document.getElementById('quest-image-preview').dataset.newImg = imgSrc;
            }
            reader.readAsDataURL(file);
        }
    });

    // 投稿完了（Publish & Clear Quest）時の処理
    window.submitQuestPost = function() {
        const questId = document.getElementById('quest-target-id').value;
        const newImgSrc = document.getElementById('quest-image-preview').dataset.newImg;
        
        if(!newImgSrc) {
            alert("写真をアップロードしてください");
            return;
        }

        // 1. データの更新 (questData)
        const questObj = questData.quests.find(q => q.id === questId);
        if(questObj) {
            questObj.isDiscovered = true;
            questObj.discoveredImg = newImgSrc;
        }

        // 2. DOMの更新（対象のカードのみを書き換え）
        const card = document.getElementById(`card-${questId}`);
        if(card) {
            card.classList.add('is-discovered');
            
            // プレースホルダーを画像に差し替え
            const photoFrame = card.querySelector('.quest-photo-frame');
            photoFrame.innerHTML = `<img src="${newImgSrc}" alt="${questObj.name}">`;
            
            // バッジとボタンの更新
            card.querySelector('.quest-status-text').innerText = '発見済';
            const actionBtn = card.querySelector('.quest-action-btn');
            actionBtn.innerText = '投稿済み';
            actionBtn.disabled = true;

            // 達成エフェクト（キラッと光る＆少しバウンス）
            gsap.fromTo(card, 
                { boxShadow: "0 0 0px rgba(212, 175, 55, 0)" },
                { boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)", duration: 0.5, yoyo: true, repeat: 1, ease: "power2.out" }
            );
            gsap.fromTo(photoFrame, { scale: 0.95 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" });
        }

        // 3. プログレスバーの再計算
        // const discoveredCount = questData.quests.filter(q => q.isDiscovered).length;
        // const totalCount = questData.quests.length;
        // const percentage = (discoveredCount / totalCount) * 100;

        if (typeof window.updateQuestProgress === 'function') {
            window.updateQuestProgress();
        }

        // =========================================
        // クエスト投稿モーダル：公開設定トグルのテキスト切り替え
        // =========================================
        const questVisibilityToggle = document.getElementById('quest-post-visibility');
        const questVisibilityLabel = document.getElementById('quest-visibility-label');
        
        if (questVisibilityToggle && questVisibilityLabel) {
            questVisibilityToggle.addEventListener('change', function() {
                if (this.checked) {
                    questVisibilityLabel.innerText = 'Public';
                    questVisibilityLabel.style.color = 'var(--text-main)';
                } else {
                    questVisibilityLabel.innerText = 'Private';
                    questVisibilityLabel.style.color = 'var(--text-muted)'; // 非公開時は少しトーンを落とす
                }
            });
        }

        // document.getElementById('quest-progress-bar').style.width = `${percentage}%`;
        // document.getElementById('quest-progress-text').innerText = `${discoveredCount} / ${totalCount} DISCOVERED`;

        // モーダルを閉じてトースト表示
        document.getElementById('quest-post-modal').classList.remove('is-active');
        showToast("Quest Cleared! 写真を投稿しました。");
    };
    // =========================================
    // フォーカスモード (右カラム折りたたみ) ＆ 状態保存
    // =========================================
    const mainLayout = document.querySelector('.split-layout');
    const focusToggleBtn = document.getElementById('focus-toggle-btn');
    
    if (mainLayout && focusToggleBtn) {
        // 1. localStorageから前回の状態を読み込み（初期化）
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
                // ★追加
                if (birdMapInstance) {
                    birdMapInstance.invalidateSize();
                }
                window.dispatchEvent(new Event('resize'));
            }, 500); 
        });
    }
    // =========================================
    // 新規投稿（New Post）モーダルのロジック
    // =========================================
    const newPostModal = document.getElementById('new-post-modal');
    const openNewPostBtn = document.getElementById('open-new-post-btn');
    const newPostCloseBtn = document.getElementById('new-post-close-btn');

    if (openNewPostBtn && newPostModal) {
        openNewPostBtn.addEventListener('click', () => {
            // フォームをリセットしてまっさらな状態で開く
            document.getElementById('form-new-post').reset();
            document.getElementById('new-current-img').style.display = 'none';
            document.getElementById('new-image-overlay').style.display = 'flex';
            document.getElementById('new-image-preview').dataset.newImg = "";
            
            // トグルラベルの初期化
            document.getElementById('new-visibility-label').innerText = 'Public';
            document.getElementById('new-visibility-label').style.color = 'var(--text-main)';
            
            newPostModal.classList.add('is-active');
        });
    }

    if (newPostCloseBtn) {
        newPostCloseBtn.addEventListener('click', () => {
            newPostModal.classList.remove('is-active');
        });
    }

    // 画像選択（プレビュー）処理
    const newImagePreview = document.getElementById('new-image-preview');
    if (newImagePreview) {
        newImagePreview.addEventListener('click', () => {
            document.getElementById('new-image-input').click();
        });

        document.getElementById('new-image-input').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const imgSrc = evt.target.result;
                    const imgEl = document.getElementById('new-current-img');
                    imgEl.src = imgSrc;
                    imgEl.style.display = 'block';
                    document.getElementById('new-image-overlay').style.display = 'none';
                    document.getElementById('new-image-preview').dataset.newImg = imgSrc;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Public/Private トグルのテキスト切り替え
    const newVisibilityToggle = document.getElementById('new-post-visibility');
    const newVisibilityLabel = document.getElementById('new-visibility-label');
    if (newVisibilityToggle && newVisibilityLabel) {
        newVisibilityToggle.addEventListener('change', function() {
            if (this.checked) {
                newVisibilityLabel.innerText = 'Public';
                newVisibilityLabel.style.color = 'var(--text-main)';
            } else {
                newVisibilityLabel.innerText = 'Private';
                newVisibilityLabel.style.color = 'var(--text-muted)';
            }
        });
    }

    // 投稿完了時
    window.submitNewPost = function() {
        const newImgSrc = document.getElementById('new-image-preview').dataset.newImg;
        if(!newImgSrc) {
            alert("写真をアップロードしてください");
            return;
        }
        
        // モーダルを閉じてトースト表示
        newPostModal.classList.remove('is-active');
        showToast("New Post Published!");
    };

});
