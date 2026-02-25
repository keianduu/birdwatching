// --- mypage.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. ギャラリーの動的生成 (components.js を利用)
    // =========================================
    const myGalleryContainer = document.getElementById('my-gallery-container');
    const myPhotos = galleryData.filter(data => data.author === "Yuki.K");

    myPhotos.forEach((data, index) => {
        const visibility = (index % 2 !== 0) ? 'private' : 'public';
        const card = BirdUI.createCard(data, { mode: 'mypage', visibility: visibility });
        myGalleryContainer.appendChild(card);
    });

    const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
    const allGalleryItems = document.querySelectorAll('#my-gallery-container .gallery-item');

    allGalleryItems.forEach(item => { item.style.display = 'block'; });

    galleryTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            galleryTabBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const targetVisibility = btn.getAttribute('data-filter');

            allGalleryItems.forEach(item => {
                if (targetVisibility === 'all' || item.getAttribute('data-visibility') === targetVisibility) {
                    item.style.display = 'block';
                    gsap.fromTo(item, 
                        { opacity: 0, scale: 0.95, y: 15 }, 
                        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                } else {
                    item.style.display = 'none';
                }
            });
            ScrollTrigger.refresh();
        });
    });

    // =========================================
    // 2. レビュー待ちギャラリーの生成 (components.js を利用)
    // =========================================
    const reviewGalleryContainer = document.getElementById('review-gallery-container');
    const reviewPhotos = galleryData.slice(3, 8); 

    reviewPhotos.forEach(data => {
        const card = BirdUI.createCard(data, { mode: 'review' });
        reviewGalleryContainer.appendChild(card);
    });

    // =========================================
    // 3. Lightbox (通常 ＆ Review 兼用)
    // =========================================
    const lightbox = document.getElementById('lightbox');
    const lbCloseBtn = document.getElementById('lightbox-close-btn');
    const lbCloseBg = document.getElementById('lightbox-close-bg');
    let currentLightboxGroup = [];
    let currentLightboxIndex = 0;
    let currentSelectedVoteType = null; 

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
                lbInfoInner.style.display = 'none';
                lbReviewInner.style.display = 'block';
                const birdName = trigger.dataset.birdName;
                document.getElementById('lb-review-title').innerText = `この鳥は「${birdName}」ですか？`;
                document.querySelectorAll('#lb-review-inner .btn-vote').forEach(b => b.classList.remove('is-selected'));
                document.getElementById('review-comment').value = '';
                currentSelectedVoteType = null;
                gsap.to([lbImg, lbReviewInner], {opacity: 1, duration: 0.3, ease: "power2.out"});
            } else {
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

    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('.lb-trigger');
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
    // 4. GSAP 初期アニメーション
    // =========================================
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    tl.fromTo(".info-inner > div", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" });

    const revealWraps = document.querySelectorAll('.reveal-wrap');
    revealWraps.forEach(wrap => {
        const mask = wrap.querySelector('.reveal-mask');
        const img = wrap.querySelector(':scope > img');
        if (mask) {
            const scrollTl = gsap.timeline({ 
                scrollTrigger: { trigger: wrap, start: "top 85%", toggleActions: "play none none none" } 
            });
            scrollTl.to(mask, { scaleY: 0, duration: 1.2, ease: "power3.inOut" }, 0);
            // 画像が少しズームアウトしながら現れるリッチな演出
            if(img) scrollTl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.5, ease: "power3.out" }, 0.2);
        }
    });

    // =========================================
    // 5. ギャラリー <-> マップ 切り替えと地図の生成
    // =========================================
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const viewSections = document.querySelectorAll('.view-section');
    let mapInitialized = false;
    let birdMapInstance = null;

    function switchView(targetId) {
        toggleBtns.forEach(b => b.classList.remove('is-active'));
        document.querySelector(`.toggle-btn[data-target="${targetId}"]`).classList.add('is-active');
        
        viewSections.forEach(section => {
            section.classList.remove('is-active');
            if(section.id === targetId) section.classList.add('is-active');
        });

        if (window.innerWidth <= 1024) {
            const galleryTabBtn = document.querySelector('.mypage-tab-btn[data-tab="tab-gallery"]');
            if (galleryTabBtn && !galleryTabBtn.classList.contains('is-active')) {
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
                } else if (birdMapInstance) {
                    birdMapInstance.invalidateSize();
                }
            }
        }, 100);
    }
    toggleBtns.forEach(btn => { btn.addEventListener('click', () => switchView(btn.getAttribute('data-target'))); });

    function initMap() {
        birdMapInstance = L.map('bird-map', { center: [35.6895, 139.6917], zoom: 11, minZoom: 10, maxZoom: 15, zoomControl: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OSM' }).addTo(birdMapInstance);
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

    // =========================================
    // 6. タブ切り替えとトースト通知
    // =========================================
    const tabBtns = document.querySelectorAll('.mypage-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    document.body.setAttribute('data-active-sp-tab', 'tab-profile');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('is-active'));
            tabContents.forEach(c => c.classList.remove('is-active'));
            
            btn.classList.add('is-active');
            document.body.setAttribute('data-active-sp-tab', targetTab); 
            
            if(targetTab !== 'tab-gallery') {
                document.getElementById(targetTab).classList.add('is-active');
            }
            
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
    // 7. クエスト(Field Quests)の動的生成 & バナー制御
    // =========================================
    function initQuests() {
        const questContainer = document.getElementById('quest-list-container');
        const progressBars = [document.getElementById('quest-progress-bar'), document.getElementById('banner-progress-bar')];
        const progressTexts = [document.getElementById('quest-progress-text'), document.getElementById('banner-progress-text')];
        
        if (!questContainer || typeof questData === 'undefined') return;

        let discoveredCount = 0;
        const totalCount = questData.quests.length;

        const birdIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>`;
        const photoPlaceholderSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;

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

        window.updateQuestProgress = function() {
            const currentDiscovered = questData.quests.filter(q => q.isDiscovered).length;
            const percentage = (currentDiscovered / totalCount) * 100;
            progressBars.forEach(bar => { if(bar) bar.style.width = `${percentage}%`; });
            progressTexts.forEach(text => { if(text) text.innerText = `${currentDiscovered} / ${totalCount} DISCOVERED`; });
        };
        
        window.updateQuestProgress();
    }
    initQuests();

    document.getElementById('quest-banner-btn').addEventListener('click', () => {
        document.getElementById('quest-overlay').classList.add('is-active');
        document.body.style.overflow = 'hidden'; 
    });
    document.getElementById('quest-overlay-close').addEventListener('click', () => {
        document.getElementById('quest-overlay').classList.remove('is-active');
        document.body.style.overflow = '';
    });


    // =========================================
    // 8. The Universal Editor (統合エディターモーダル)
    // =========================================
    const uniModal = document.getElementById('universal-post-modal');
    const uniForm = document.getElementById('form-universal-post');
    const uniModeInput = document.getElementById('universal-mode');
    const uniTargetInput = document.getElementById('universal-target-id');
    const uniTitleEl = document.getElementById('universal-modal-title');
    const uniSubmitBtn = document.getElementById('universal-submit-btn');
    const uniVisibilityGroup = document.getElementById('universal-visibility-group');
    const uniImgPreview = document.getElementById('universal-image-preview');
    const uniCurrentImg = document.getElementById('universal-current-img');
    const uniImgOverlay = document.getElementById('universal-image-overlay');
    const uniVisibilityToggle = document.getElementById('universal-post-visibility');

    let currentEditItemRef = null;

    // トグルの文字切り替え
    if (uniVisibilityToggle) {
        uniVisibilityToggle.addEventListener('change', function() {
            const label = document.getElementById('universal-visibility-label');
            if (this.checked) {
                label.innerText = 'Public';
                label.style.color = 'var(--text-main)';
            } else {
                label.innerText = 'Private';
                label.style.color = 'var(--text-muted)';
            }
        });
    }

    // 汎用オープナー
    function openEditorModal(mode, options = {}) {
        uniForm.reset();
        uniModeInput.value = mode;
        uniImgPreview.dataset.newImg = "";
        
        if (mode === 'new') {
            uniTitleEl.innerText = 'Create New Post';
            uniSubmitBtn.innerText = 'Publish Post';
            uniVisibilityGroup.style.display = 'block';
            setupImagePreview(null);
            
        } else if (mode === 'quest') {
            uniTitleEl.innerText = `${options.birdName} の写真を投稿`;
            uniSubmitBtn.innerText = 'Publish & Clear Quest';
            uniTargetInput.value = options.questId;
            uniVisibilityGroup.style.display = 'block';
            setupImagePreview(null);
            
        } else if (mode === 'edit') {
            uniTitleEl.innerText = 'Edit Post';
            uniSubmitBtn.innerText = 'Save Changes';
            uniVisibilityGroup.style.display = 'none'; 
            currentEditItemRef = options.element;
            
            document.getElementById('universal-post-title').value = currentEditItemRef.dataset.title;
            document.getElementById('universal-post-location').value = currentEditItemRef.dataset.location;
            document.getElementById('universal-post-comment').value = currentEditItemRef.dataset.comment;
            setupImagePreview(currentEditItemRef.querySelector('img').src);
        }
        uniModal.classList.add('is-active');
    }

    function setupImagePreview(imgSrc) {
        if (imgSrc) {
            uniCurrentImg.src = imgSrc;
            uniCurrentImg.style.display = 'block';
            uniImgOverlay.style.display = 'none';
        } else {
            uniCurrentImg.src = '';
            uniCurrentImg.style.display = 'none';
            uniImgOverlay.style.display = 'flex';
        }
    }

    // 画像選択
    uniImgPreview.addEventListener('click', () => document.getElementById('universal-image-input').click());
    document.getElementById('universal-image-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                setupImagePreview(evt.target.result);
                uniImgPreview.dataset.newImg = evt.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // 閉じる処理
    const closeModals = () => {
        if(uniModal) uniModal.classList.remove('is-active');
        document.getElementById('delete-modal').classList.remove('is-active');
        currentEditItemRef = null;
    };
    document.getElementById('universal-close-btn').addEventListener('click', closeModals);
    document.getElementById('delete-cancel-btn').addEventListener('click', closeModals);
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) { if (e.target === this) closeModals(); });
    });

    // 統合Submit
    window.submitUniversalPost = function() {
        const mode = uniModeInput.value;
        const newImgSrc = uniImgPreview.dataset.newImg;

        if (mode === 'new') {
            if(!newImgSrc) return alert("写真をアップロードしてください");
            showToast("New Post Published!");
            
        } else if (mode === 'quest') {
            if(!newImgSrc) return alert("写真をアップロードしてください");
            const questId = uniTargetInput.value;
            
            const questObj = questData.quests.find(q => q.id === questId);
            if(questObj) {
                questObj.isDiscovered = true;
                questObj.discoveredImg = newImgSrc;
            }
            const card = document.getElementById(`card-${questId}`);
            if(card) {
                card.classList.add('is-discovered');
                card.querySelector('.quest-photo-frame').innerHTML = `<img src="${newImgSrc}" alt="${questObj.name}">`;
                card.querySelector('.quest-status-text').innerText = '発見済';
                const actionBtn = card.querySelector('.quest-action-btn');
                actionBtn.innerText = '投稿済み';
                actionBtn.disabled = true;
            }
            if (typeof window.updateQuestProgress === 'function') window.updateQuestProgress();
            showToast("Quest Cleared! 写真を投稿しました。");
            
        } else if (mode === 'edit') {
            if (currentEditItemRef) {
                const newTitle = document.getElementById('universal-post-title').value;
                const newLocation = document.getElementById('universal-post-location').value;
                const newComment = document.getElementById('universal-post-comment').value;
                
                currentEditItemRef.dataset.title = newTitle;
                currentEditItemRef.dataset.location = newLocation;
                currentEditItemRef.dataset.comment = newComment;
                
                currentEditItemRef.querySelector('.caption-title').innerText = newTitle;
                currentEditItemRef.querySelector('.shoot-area').innerText = '📍 ' + newLocation;
                
                if (newImgSrc) {
                    currentEditItemRef.dataset.img = newImgSrc;
                    currentEditItemRef.querySelector(':scope > img').src = newImgSrc;
                }
                showToast("Post Updated Successfully!");
            }
        }
        closeModals();
    };

    // --- 各種トリガー ---
    document.getElementById('open-new-post-btn')?.addEventListener('click', () => openEditorModal('new'));
    
    window.openQuestPostModal = function(questId, birdName) {
        openEditorModal('quest', { questId, birdName });
    };

    // Edit と Delete はイベントデリゲーションで監視
    let currentDeleteItem = null;
    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');
        
        if (editBtn) {
            openEditorModal('edit', { element: editBtn.closest('.gallery-item') });
        }
        if (deleteBtn) {
            currentDeleteItem = deleteBtn.closest('.gallery-item');
            document.getElementById('delete-modal').classList.add('is-active');
        }
    });

    // Delete 処理
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
    // 9. フォーカスモード (右カラム折りたたみ)
    // =========================================
    const mainLayout = document.querySelector('.split-layout');
    const focusToggleBtn = document.getElementById('focus-toggle-btn');
    
    if (mainLayout && focusToggleBtn) {
        const isFocused = localStorage.getItem('aves_focus_mode') === 'true';
        if (isFocused) {
            mainLayout.classList.add('is-focused');
        }

        focusToggleBtn.addEventListener('click', () => {
            const willBeFocused = !mainLayout.classList.contains('is-focused');
            mainLayout.classList.toggle('is-focused');
            localStorage.setItem('aves_focus_mode', willBeFocused);
            
            setTimeout(() => {
                ScrollTrigger.refresh();
                if (birdMapInstance) birdMapInstance.invalidateSize();
                window.dispatchEvent(new Event('resize'));
            }, 500); 
        });
    }

});