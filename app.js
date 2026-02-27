// --- app.js (Unified SPA Controller) ---
document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. App State (状態管理)
    // =========================================
    const AppState = {
        category: 'pickup', // 'pickup' | 'timeline' | 'mypost'
        view: 'grid',       // 'grid' | 'map'
        timelineFilter: 'all', // 'all' | 'unvoted' | 'voted'
        mypostFilter: 'public' // 'public' | 'private'
    };

    const DOM = {
        mainGallery: document.getElementById('main-gallery-container'),
        viewGrid: document.getElementById('view-grid'),
        viewMap: document.getElementById('view-map'),
        navTimeline: document.getElementById('nav-timeline'),
        navMypost: document.getElementById('nav-mypost'),
        rightConcept: document.getElementById('right-concept-panel'),
        rightDashboard: document.getElementById('right-dashboard-panel'),
        filterNotice: document.getElementById('filter-notice'),
        filterAreaName: document.getElementById('filter-area-name')
    };

    let birdMapInstance = null;
    let isMapInitialized = false;

    // =========================================
    // 2. Main Renderer (画面の再描画)
    // =========================================
    function renderApp() {
        // --- 1. 右カラム（コンセプト or ダッシュボード）---
        if (AppState.category === 'pickup') {
            DOM.rightConcept.style.display = 'block';
            DOM.rightDashboard.style.display = 'none';
        } else {
            DOM.rightConcept.style.display = 'none';
            DOM.rightDashboard.style.display = 'block';
        }

        // --- 2. 左カラム上部ローカルナビ ---
        DOM.navTimeline.style.display = (AppState.category === 'timeline') ? 'flex' : 'none';
        DOM.navMypost.style.display = (AppState.category === 'mypost') ? 'flex' : 'none';

        // --- 3. 表示形式（Grid or Map）---
        if (AppState.view === 'grid') {
            DOM.viewGrid.style.display = 'block';
            DOM.viewMap.style.display = 'none';
        } else {
            DOM.viewGrid.style.display = 'none';
            DOM.viewMap.style.display = 'block';
            DOM.filterNotice.classList.remove('is-active'); // マップ時はフィルター通知オフ
        }

        // --- 4. データのフィルタリング ---
        let filteredData = galleryData;

        if (AppState.category === 'pickup') {
            // モック: 最初の6件をピックアップ
            filteredData = galleryData.slice(0, 6);
        } else if (AppState.category === 'timeline') {
            if (AppState.timelineFilter === 'unvoted') {
                filteredData = galleryData.filter((_, i) => i % 2 !== 0); // モック
            } else if (AppState.timelineFilter === 'voted') {
                filteredData = galleryData.slice(6, 10); // モック
            }
        } else if (AppState.category === 'mypost') {
            const myData = galleryData.filter(d => d.author === 'Yuki.K');
            if (AppState.mypostFilter === 'public') {
                filteredData = myData.filter((_, i) => i % 2 === 0);
            } else {
                filteredData = myData.filter((_, i) => i % 2 !== 0);
            }
        }

        // --- 5. DOMの構築 ---
        if (AppState.view === 'grid') {
            DOM.mainGallery.innerHTML = '';
            filteredData.forEach(data => {
                const mode = (AppState.category === 'mypost') ? 'mypage' 
                           : (AppState.category === 'timeline' && AppState.timelineFilter === 'unvoted') ? 'review' 
                           : 'default';
                const card = BirdUI.createCard(data, { mode: mode });
                DOM.mainGallery.appendChild(card);
            });
            // GSAP アニメーション
            gsap.fromTo('.gallery-item', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.05 });
            ScrollTrigger.refresh();
        } else {
            // Map
            if (!isMapInitialized) {
                initMap();
                isMapInitialized = true;
            }
            updateMapMarkers(filteredData);
            setTimeout(() => { if (birdMapInstance) birdMapInstance.invalidateSize(); }, 100);
        }
    }

    // =========================================
    // 3. Navigation Events
    // =========================================
    // カプセルメニュー（＋スマホ用メニュー）
    document.querySelectorAll('.toggle-btn, .toggle-btn-sp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('is-active'));
            // PC用のカプセルメニューの見た目だけアクティブにする
            const targetCategory = e.currentTarget.dataset.category;
            const pcBtn = document.querySelector(`.toggle-btn[data-category="${targetCategory}"]`);
            if(pcBtn) pcBtn.classList.add('is-active');
            
            AppState.category = targetCategory;
            renderApp();
            
            // スマホ用メニューが開いていたら閉じる
            if (document.getElementById('menu-overlay').classList.contains('is-active')) {
                document.getElementById('hamburger-btn').click();
            }
        });
    });

    // スイッチ（Grid/Map）
    document.querySelectorAll('.view-switch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-switch-btn').forEach(b => b.classList.remove('is-active'));
            e.currentTarget.classList.add('is-active');
            AppState.view = e.currentTarget.dataset.view;
            renderApp();
        });
    });

    // ローカルタブ（Timeline / MyPost）
    document.querySelectorAll('.local-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentNav = e.currentTarget.closest('.local-nav');
            parentNav.querySelectorAll('.local-tab-btn').forEach(b => b.classList.remove('is-active'));
            e.currentTarget.classList.add('is-active');
            
            if (AppState.category === 'timeline') AppState.timelineFilter = e.currentTarget.dataset.filter;
            if (AppState.category === 'mypost') AppState.mypostFilter = e.currentTarget.dataset.filter;
            renderApp();
        });
    });

    // ショートカットFAB
    document.getElementById('shortcut-mypost-btn').addEventListener('click', () => {
        document.querySelector('.toggle-btn[data-category="mypost"]').click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =========================================
    // 4. Map Logic
    // =========================================
    function initMap() {
        birdMapInstance = L.map('bird-map', {
            center: [35.6895, 139.6917], zoom: 11, minZoom: 10, maxZoom: 15,
            zoomControl: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OSM' }).addTo(birdMapInstance);
    }

    let currentMarkers = [];
    function updateMapMarkers(dataArray) {
        if (!birdMapInstance) return;
        currentMarkers.forEach(m => birdMapInstance.removeLayer(m));
        currentMarkers = [];

        const locationsMap = {};
        dataArray.forEach(item => {
            const key = `${item.lat},${item.lng}`;
            if (!locationsMap[key]) locationsMap[key] = { id: item.areaId, title: item.areaTitle, lat: item.lat, lng: item.lng, birds: [] };
            locationsMap[key].birds.push(item);
        });

        Object.values(locationsMap).forEach(loc => {
            const birdCount = loc.birds.length;
            const coverImage = loc.birds[0].imgThumb;
            const badgeHtml = birdCount > 1 ? `<div class="echo-count">${birdCount}</div>` : '';
            const echoIcon = L.divIcon({
                className: 'custom-echo-icon',
                html: `<div class="echo-marker"><div class="echo-pulse"></div><div class="echo-core" style="background-image: url('${coverImage}');">${badgeHtml}</div></div>`,
                iconSize: [80, 80], iconAnchor: [40, 40], popupAnchor: [0, -25]
            });
            let popupHtml = `<div class="custom-popup"><div class="popup-header"><p>📍 Area: ${loc.title}</p></div><div class="popup-slider">`;
            loc.birds.forEach(bird => { popupHtml += BirdUI.createCard(bird, { mode: 'popup' }).outerHTML; });
            popupHtml += `</div><button class="filter-cta-btn" data-filter-id="${loc.id}" data-filter-name="${loc.title}">Filter Gallery</button></div>`;
            
            const marker = L.marker([loc.lat, loc.lng], { icon: echoIcon }).bindPopup(popupHtml);
            marker.addTo(birdMapInstance);
            currentMarkers.push(marker);
        });
    }

    // マップからのエリア絞り込み
    document.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('filter-cta-btn')) {
            const areaId = e.target.getAttribute('data-filter-id');
            const areaName = e.target.getAttribute('data-filter-name');
            
            // Gridビューに戻す
            document.querySelector('.view-switch-btn[data-view="grid"]').click();
            
            DOM.filterAreaName.innerText = areaName;
            DOM.filterNotice.classList.add('is-active');

            const galleryItems = document.querySelectorAll('#main-gallery-container .gallery-item');
            galleryItems.forEach(item => {
                if(item.getAttribute('data-area') === areaId) {
                    item.style.display = 'block';
                    gsap.fromTo(item, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.8});
                } else { item.style.display = 'none'; }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('clear-filter-btn').addEventListener('click', () => {
        DOM.filterNotice.classList.remove('is-active');
        renderApp(); // 現在の状態で再描画
    });

    // =========================================
    // 5. Lightbox & Review
    // =========================================
    const lightbox = document.getElementById('lightbox');
    let currentLightboxGroup = [];
    let currentLightboxIndex = 0;
    let currentSelectedVoteType = null;

    function openLightbox(trigger) {
        const container = trigger.closest('.gallery-masonry, .popup-slider');
        currentLightboxGroup = container ? Array.from(container.querySelectorAll('.lb-trigger')).filter(el => el.offsetParent !== null) : [trigger];
        currentLightboxIndex = currentLightboxGroup.indexOf(trigger);
        
        document.querySelectorAll('.lb-nav-btn').forEach(btn => btn.style.display = (currentLightboxGroup.length <= 1) ? 'none' : 'flex');
        updateLightboxContent(trigger);
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxContent(trigger) {
        const lbImg = document.getElementById('lb-img');
        const lbInfoInner = document.getElementById('lb-info-inner');
        const lbReviewInner = document.getElementById('lb-review-inner');
        const isReview = trigger.classList.contains('review-trigger');
        
        gsap.to([lbImg, lbInfoInner, lbReviewInner], {opacity: 0, duration: 0.2, onComplete: () => {
            lbImg.src = trigger.getAttribute('data-img');
            if (isReview) {
                lbInfoInner.style.display = 'none';
                lbReviewInner.style.display = 'block';
                document.getElementById('lb-review-title').innerText = `この鳥は「${trigger.dataset.birdName}」ですか？`;
                document.querySelectorAll('#lb-review-inner .btn-vote').forEach(b => b.classList.remove('is-selected'));
                document.getElementById('review-comment').value = '';
                currentSelectedVoteType = null;
                gsap.to([lbImg, lbReviewInner], {opacity: 1, duration: 0.3});
            } else {
                lbInfoInner.style.display = 'block';
                lbReviewInner.style.display = 'none';
                document.getElementById('lb-title').innerText = trigger.getAttribute('data-title');
                document.getElementById('lb-author').innerText = trigger.getAttribute('data-author');
                document.getElementById('lb-avatar').src = trigger.getAttribute('data-avatar');
                document.getElementById('lb-location').innerText = '📍 ' + trigger.getAttribute('data-location');
                document.getElementById('lb-comment').innerText = trigger.getAttribute('data-comment');
                document.getElementById('lb-gear').innerText = trigger.getAttribute('data-gear');
                gsap.to([lbImg, lbInfoInner], {opacity: 1, duration: 0.3});
            }
        }});
    }

    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('.lb-trigger');
        if (trigger && !e.target.closest('.action-btn')) openLightbox(trigger);
    });

    document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
    function navigateLightbox(dir) {
        if (currentLightboxGroup.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + dir + currentLightboxGroup.length) % currentLightboxGroup.length;
        updateLightboxContent(currentLightboxGroup[currentLightboxIndex]);
    }

    const closeLightbox = () => { lightbox.classList.remove('is-active'); document.body.style.overflow = ''; };
    document.getElementById('lightbox-close-btn').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-close-bg').addEventListener('click', closeLightbox);

    window.selectReviewVote = (type, btnElement) => {
        document.querySelectorAll('#lb-review-inner .btn-vote').forEach(b => b.classList.remove('is-selected'));
        btnElement.classList.add('is-selected');
        currentSelectedVoteType = type;
    };
    window.submitReviewVote = () => {
        if (!currentSelectedVoteType) return alert("評価を選択してください。");
        closeLightbox();
        showToast("レビューを送信しました！");
    };

    // =========================================
    // 6. Right Dashboard (Tabs & Modals)
    // =========================================
    // 右カラムのタブ切り替え
    document.querySelectorAll('.mypage-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mypage-tab-btn').forEach(b => b.classList.remove('is-active'));
            document.querySelectorAll('#right-dashboard-panel .tab-content').forEach(c => c.classList.remove('is-active'));
            btn.classList.add('is-active');
            document.getElementById(btn.getAttribute('data-tab')).classList.add('is-active');
        });
    });

    // ハンバーガーメニュー (SP)
    document.getElementById('hamburger-btn').addEventListener('click', function() {
        this.classList.toggle('is-active');
        document.getElementById('menu-overlay').classList.toggle('is-active');
        document.body.style.overflow = this.classList.contains('is-active') ? 'hidden' : '';
    });

    // 汎用トースト
    window.showToast = function(message) {
        const toast = document.getElementById('toast');
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // =========================================
    // 7. Initial GSAP & Setup
    // =========================================
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    tl.to(".divider", { width: "100%", duration: 1.5, ease: "power3.inOut" }, 0.2);
    tl.fromTo(".logo, .hamburger, .split-text, .fade-text", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 }, 0.5);

    renderApp();

    // =========================================
    // 8. Field Quests & Universal Editor
    // =========================================
    function initQuests() {
        const questContainer = document.getElementById('quest-list-container');
        if (!questContainer || typeof questData === 'undefined') return;
        
        let discoveredCount = 0;
        const totalCount = questData.quests.length;
        const birdIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>`;

        questData.quests.forEach(quest => {
            if (quest.isDiscovered) discoveredCount++;
            const diffClass = quest.difficulty === '見つけたい' ? 'rare' : 'common';
            const cardHTML = `
                <div class="quest-card ${quest.isDiscovered ? 'is-discovered' : ''}" id="card-${quest.id}">
                    <div class="quest-header">
                        <div class="quest-icon">${birdIconSVG}</div>
                        <div class="quest-title-wrap">
                            <h3 class="quest-name">${quest.name}</h3>
                            <span class="quest-env">環境：${quest.environment}</span>
                        </div>
                        <div class="quest-difficulty ${diffClass}">${quest.difficulty}</div>
                    </div>
                    <div class="quest-photo-frame">
                        ${quest.isDiscovered ? `<img src="${quest.discoveredImg}" alt="${quest.name}">` : `<div class="quest-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`}
                    </div>
                    <div class="quest-body">
                        <div class="quest-status-badges"><span class="badge-status quest-status-text">${quest.isDiscovered ? '発見済' : '未発見'}</span></div>
                        <button class="btn-quest-log quest-action-btn" ${quest.isDiscovered ? 'disabled' : ''} onclick="openQuestPostModal('${quest.id}', '${quest.name}')">
                            ${quest.isDiscovered ? '投稿済み' : '写真を投稿'}
                        </button>
                    </div>
                </div>`;
            questContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        window.updateQuestProgress = () => {
            const current = questData.quests.filter(q => q.isDiscovered).length;
            const pct = (current / totalCount) * 100;
            ['quest-progress-bar', 'banner-progress-bar'].forEach(id => {
                const el = document.getElementById(id); if(el) el.style.width = `${pct}%`;
            });
            ['quest-progress-text', 'banner-progress-text'].forEach(id => {
                const el = document.getElementById(id); if(el) el.innerText = `${current} / ${totalCount} DISCOVERED`;
            });
        };
        window.updateQuestProgress();
    }
    initQuests();

    document.getElementById('quest-banner-btn')?.addEventListener('click', () => { document.getElementById('quest-overlay').classList.add('is-active'); document.body.style.overflow = 'hidden'; });
    document.getElementById('quest-overlay-close')?.addEventListener('click', () => { document.getElementById('quest-overlay').classList.remove('is-active'); document.body.style.overflow = ''; });

    // エディターモーダル
    const uniModal = document.getElementById('universal-post-modal');
    window.openQuestPostModal = (questId, birdName) => {
        document.getElementById('form-universal-post').reset();
        document.getElementById('universal-mode').value = 'quest';
        document.getElementById('universal-target-id').value = questId;
        document.getElementById('universal-modal-title').innerText = `${birdName} の記録`;
        document.getElementById('universal-current-img').style.display = 'none';
        document.getElementById('universal-image-overlay').style.display = 'flex';
        uniModal.classList.add('is-active');
    };
    
    document.getElementById('open-new-post-btn')?.addEventListener('click', () => {
        document.getElementById('form-universal-post').reset();
        document.getElementById('universal-mode').value = 'new';
        document.getElementById('universal-modal-title').innerText = 'New Post';
        document.getElementById('universal-current-img').style.display = 'none';
        document.getElementById('universal-image-overlay').style.display = 'flex';
        uniModal.classList.add('is-active');
    });

    const closeModals = () => { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-active')); };
    document.getElementById('universal-close-btn')?.addEventListener('click', closeModals);
    document.getElementById('delete-cancel-btn')?.addEventListener('click', closeModals);
    
    // Edit & Delete (Event Delegation)
    let currentEditItemRef = null;
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');
        if (editBtn) {
            currentEditItemRef = editBtn.closest('.gallery-item');
            document.getElementById('universal-mode').value = 'edit';
            document.getElementById('universal-modal-title').innerText = 'Edit Post';
            document.getElementById('universal-post-comment').value = currentEditItemRef.dataset.comment;
            uniModal.classList.add('is-active');
        }
        if (deleteBtn) {
            currentEditItemRef = deleteBtn.closest('.gallery-item');
            document.getElementById('delete-modal').classList.add('is-active');
        }
    });

    document.getElementById('delete-confirm-btn')?.addEventListener('click', () => {
        if (currentEditItemRef) { currentEditItemRef.remove(); showToast("Deleted."); }
        closeModals();
    });

    window.submitUniversalPost = () => {
        showToast("Published!");
        closeModals();
        if(document.getElementById('universal-mode').value === 'quest') window.updateQuestProgress(); // 簡易モック
    };

    document.getElementById('universal-image-input')?.addEventListener('change', function(e) {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                document.getElementById('universal-current-img').src = evt.target.result;
                document.getElementById('universal-current-img').style.display = 'block';
                document.getElementById('universal-image-overlay').style.display = 'none';
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    document.getElementById('universal-image-preview')?.addEventListener('click', () => document.getElementById('universal-image-input').click());

    // Focus Mode
    const mainLayout = document.querySelector('.split-layout');
    const focusToggleBtn = document.getElementById('focus-toggle-btn');
    if (focusToggleBtn) {
        focusToggleBtn.addEventListener('click', () => {
            mainLayout.classList.toggle('is-focused');
            setTimeout(() => { ScrollTrigger.refresh(); if (birdMapInstance) birdMapInstance.invalidateSize(); }, 500); 
        });
    }
});