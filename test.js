(function () {
    'use strict';

    const host = location.hostname;
    const debug = true;

    // Headers
    const t = {
        title: "LinkFlow Pro",
        pleaseSolveCaptcha: "Awaiting verification",
        captchaSuccess: "Verification complete",
        redirectingToWork: "Preparing redirect...",
        bypassSuccessCopy: "Process complete • Key secured",
        bypassSuccess: "Redirecting in {time}s",
        backToCheckpoint: "Finalizing redirect...",
        captchaSuccessBypassing: "Verified • Processing...",
        version: "v2.0.1",
        madeBy: "Crafted with precision"
    };

    // Enhanced UI Panel
    class BypassPanel {
        constructor() {
            this.init();
        }

        init() {
            const container = document.createElement('div');
            const shadow = container.attachShadow({ mode: 'closed' });

            shadow.innerHTML = `
                <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                .panel-container {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    width: 360px;
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                .panel {
                    background: rgba(15, 15, 20, 0.92);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    box-shadow: 
                        0 24px 48px rgba(0, 0, 0, 0.4),
                        0 8px 16px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    animation: panelEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                @keyframes panelEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .header {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
                    padding: 18px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        110deg,
                        transparent 25%,
                        rgba(255, 255, 255, 0.15) 50%,
                        transparent 75%
                    );
                    animation: headerShimmer 3s ease-in-out infinite;
                }
                
                @keyframes headerShimmer {
                    0%, 100% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 1; }
                }
                
                .title-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    z-index: 1;
                }
                
                .icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .icon svg {
                    width: 100%;
                    height: 100%;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }
                
                .title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: -0.02em;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .controls {
                    display: flex;
                    gap: 8px;
                    position: relative;
                    z-index: 1;
                }
                
                .control-btn {
                    background: rgba(255, 255, 255, 0.12);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #fff;
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(8px);
                }
                
                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }
                
                .control-btn:active {
                    transform: translateY(0);
                }
                
                .status-section {
                    padding: 20px;
                }
                
                .status-card {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 14px;
                    padding: 16px;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .status-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.04),
                        transparent
                    );
                    animation: cardShimmer 2.5s infinite;
                }
                
                @keyframes cardShimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                
                .status-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    position: relative;
                    z-index: 1;
                }
                
                .status-indicator {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    position: relative;
                }
                
                .status-indicator::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 13px;
                    padding: 2px;
                    background: linear-gradient(135deg, currentColor, transparent);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0.3;
                }
                
                .status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    animation: statusPulse 2s ease-in-out infinite;
                    box-shadow: 0 0 16px currentColor, 0 0 32px currentColor;
                }
                
                @keyframes statusPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
                
                .status-indicator.info { color: #60a5fa; background: rgba(96, 165, 250, 0.12); }
                .status-indicator.success { color: #4ade80; background: rgba(74, 222, 128, 0.12); }
                .status-indicator.warning { color: #fbbf24; background: rgba(251, 191, 36, 0.12); }
                .status-indicator.error { color: #f87171; background: rgba(248, 113, 113, 0.12); }
                
                .status-text-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                }
                
                .status-text {
                    color: rgba(255, 255, 255, 0.95);
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 1.5;
                    letter-spacing: -0.01em;
                }
                
                .status-subtext {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    font-weight: 400;
                    letter-spacing: -0.01em;
                }
                
                .panel-body {
                    max-height: 200px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 1;
                }
                
                .panel-body.hidden {
                    max-height: 0;
                    opacity: 0;
                }
                
                .info-section {
                    padding: 18px 20px;
                    background: rgba(0, 0, 0, 0.2);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .info-grid {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .version {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                
                .credit {
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 11px;
                    font-weight: 400;
                    font-style: italic;
                    letter-spacing: -0.01em;
                }
                
                @media (max-width: 480px) {
                    .panel-container {
                        top: 16px;
                        right: 16px;
                        left: 16px;
                        width: auto;
                    }
                }
                
                @media (prefers-color-scheme: light) {
                    .panel {
                        background: rgba(255, 255, 255, 0.92);
                        border-color: rgba(0, 0, 0, 0.08);
                    }
                    .status-text { color: rgba(0, 0, 0, 0.9); }
                    .status-subtext { color: rgba(0, 0, 0, 0.5); }
                    .version { color: rgba(0, 0, 0, 0.4); }
                    .credit { color: rgba(0, 0, 0, 0.3); }
                }
                </style>
                <div class="panel-container">
                    <div class="panel">
                        <div class="header">
                            <div class="title-wrapper">
                                <div class="icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" opacity="0.9"/>
                                    </svg>
                                </div>
                                <div class="title">${t.title}</div>
                            </div>
                            <div class="controls">
                                <button class="control-btn" id="btn" title="Toggle panel">−</button>
                            </div>
                        </div>
                        <div class="status-section">
                            <div class="status-card">
                                <div class="status-content">
                                    <div class="status-indicator info" id="indicator">
                                        <div class="status-dot" id="dot"></div>
                                    </div>
                                    <div class="status-text-wrapper">
                                        <div class="status-text" id="text">${t.pleaseSolveCaptcha}</div>
                                        <div class="status-subtext" id="subtext">Processing request</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body" id="body">
                            <div class="info-section">
                                <div class="info-grid">
                                    <div class="version">${t.version}</div>
                                    <div class="credit">${t.madeBy}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.statusText = shadow.getElementById('text');
            this.statusSubtext = shadow.getElementById('subtext');
            this.statusDot = shadow.getElementById('dot');
            this.statusIndicator = shadow.getElementById('indicator');
            const body = shadow.getElementById('body');
            const btn = shadow.getElementById('btn');

            btn.onclick = () => {
                body.classList.toggle('hidden');
                btn.textContent = body.classList.contains('hidden') ? '+' : '−';
            };

            document.documentElement.appendChild(container);
        }

        show(msg, type = 'info', replacements = {}) {
            let text = t[msg] || msg;
            Object.keys(replacements).forEach(k => {
                text = text.replace(`{${k}}`, replacements[k]);
            });
            
            this.statusText.textContent = text;
            this.statusIndicator.className = `status-indicator ${type}`;
            
            // Update subtext based on type
            const subtexts = {
                info: 'Processing request',
                success: 'Operation successful',
                warning: 'Please wait',
                error: 'Action required'
            };
            this.statusSubtext.textContent = subtexts[type] || 'Processing request';
        }
    }

    const panel = new BypassPanel();

    // Handler for VOLCANO
    if (host.includes("key.volcano.wtf")) {
        if (debug) console.log('[Debug] Waiting Captcha');

        let continueClicked = false;

        const actOnCheckpoint = (node) => {
            if (!continueClicked) {
                const btns = (node?.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"]'));

                for (const btn of btns) {
                    const text = (btn.innerText || '').trim().toLowerCase();
                    if ((text.includes("continue") || text.includes("next step")) &&
                        !btn.disabled &&
                        btn.offsetParent) {
                        continueClicked = true;
                        panel.show('captchaSuccess', 'success');
                        if (debug) console.log('[Debug] Captcha Solved');
                        setTimeout(() => {
                            btn.click();
                            panel.show('redirectingToWork', 'info');
                            if (debug) console.log('[Debug] Clicking Continue');
                        }, 300);
                        return true;
                    }
                }
            }

            const copyBtn = (node?.nodeType === 1
                ? node.matches("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                    ? node
                    : node.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                : document.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']"));

            if (copyBtn) {
                setInterval(() => {
                    copyBtn.click();
                    if (debug) console.log('[Debug] Copy button spam click');
                    panel.show('bypassSuccessCopy', 'success');
                }, 500);
                return true;
            }
            return false;
        };

        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList') {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1 && actOnCheckpoint(node)) return;
                    }
                } else if (m.type === 'attributes' && m.target.nodeType === 1) {
                    if (actOnCheckpoint(m.target)) return;
                }
            }
        });

        mo.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'aria-disabled', 'style']
        });

        actOnCheckpoint();
    }

    // Handler for WORK.INK
    if (host.includes("work.ink")) {
        const startTime = Date.now();
        let sessionController, sendMessageA, onLinkInfoA, onLinkDestinationA;
        let bypassTriggered = false;

        const map = { onLI: ["onLinkInfo"], onLD: ["onLinkDestination"] };
        const types = {
            mo: 'c_monetization',
            ss: 'c_social_started',
            tr: 'c_turnstile_response',
            ad: 'c_adblocker_detected'
        };

        const getFunction = (obj, candidates = null) => {
            if (candidates) {
                for (const name of candidates) {
                    if (typeof obj[name] === "function") return { fn: obj[name], name };
                }
            } else {
                for (const i in obj) {
                    if (typeof obj[i] === "function" && obj[i].length === 2) {
                        return { fn: obj[i], name: i };
                    }
                }
            }
            return { fn: null, name: null };
        };

        const triggerBypass = (reason) => {
            if (bypassTriggered) return;
            bypassTriggered = true;
            if (debug) console.log('[Debug] trigger Bypass via:', reason);
            panel.show('captchaSuccessBypassing', 'success');
            try {
                spoofWorkink();
                triggerBp();
            } catch (e) {
                if (debug) console.warn('[Debug] Bypass failed:', e);
            }
        };

        const spoofWorkink = () => {
            if (!sessionController?.linkInfo) return;
            if (debug) console.log('[Debug] spoof Workink starting');

            for (const soc of sessionController.linkInfo.socials || []) {
                sendMessageA?.call(this, types.ss, { url: soc.url });
            }

            const monetizationMap = {
                22: () => sendMessageA?.call(this, types.mo, { type: 'readArticles2', payload: { event: 'read' } }),
                25: () => {
                    sendMessageA?.call(this, types.mo, { type: 'operaGX', payload: { event: 'start' } });
                    fetch('https://work.ink/_api/v2/callback/operaGX', {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ noteligible: true })
                    }).catch(() => {});
                },
                34: () => sendMessageA?.call(this, types.mo, { type: 'norton', payload: { event: 'start' } }),
                71: () => sendMessageA?.call(this, types.mo, { type: 'externalArticles', payload: { event: 'start' } }),
                45: () => sendMessageA?.call(this, types.mo, { type: 'pdfeditor', payload: { event: 'installed' } }),
                57: () => sendMessageA?.call(this, types.mo, { type: 'betterdeals', payload: { event: 'installed' } })
            };

            for (const m of sessionController.linkInfo.monetizations || []) {
                monetizationMap[m]?.();
            }
        };

        const trm = () => function(...a) {
            const [msgType] = a;
            if (msgType === types.ad) return;
            if (sessionController?.linkInfo && msgType === types.tr) {
                triggerBypass('tr');
            }
            return sendMessageA?.apply(this, a);
        };

        const createLinkInfoProxy = () => function(...args) {
            const [info] = args;
            try {
                Object.defineProperty(info, 'isAdblockEnabled', {
                    get: () => false,
                    set: () => {},
                    configurable: false,
                    enumerable: true
                });
            } catch (e) {}
            return onLinkInfoA?.apply(this, args);
        };

        const startCountdown = (url, waitLeft) => {
            panel.show('bypassSuccess', 'warning', { time: Math.ceil(waitLeft) });
            const interval = setInterval(() => {
                waitLeft -= 1;
                if (waitLeft > 0) {
                    panel.show('bypassSuccess', 'warning', { time: Math.ceil(waitLeft) });
                } else {
                    clearInterval(interval);
                    window.location.href = url;
                }
            }, 1000);
        };

        const createDestinationProxy = () => function(...args) {
            const [data] = args;
            const secondsPassed = (Date.now() - startTime) / 1000;
            let waitTimeSeconds = 5;
            const url = location.href;
            if (url.includes('42rk6hcq') || url.includes('ito4wckq') || url.includes('pzarvhq1')) {
                waitTimeSeconds = 38;
            }
            if (secondsPassed >= waitTimeSeconds) {
                panel.show('backToCheckpoint', 'info');
                window.location.href = data.url;
            } else {
                startCountdown(data.url, waitTimeSeconds - secondsPassed);
            }
            return onLinkDestinationA?.apply(this, args);
        };

        const triggerBp = () => {
            if (sessionController?.linkDestination) {
                createDestinationProxy().call(sessionController, sessionController.linkDestination);
            }
        };

        const setupProxies = () => {
            const send = getFunction(sessionController);
            const info = getFunction(sessionController, map.onLI);
            const dest = getFunction(sessionController, map.onLD);

            if (!send.fn || !info.fn || !dest.fn) return;

            sendMessageA = send.fn;
            onLinkInfoA = info.fn;
            onLinkDestinationA = dest.fn;

            try {
                Object.defineProperty(sessionController, send.name, {
                    get: trm,
                    set: v => (sendMessageA = v),
                    configurable: true
                });
                Object.defineProperty(sessionController, info.name, {
                    get: createLinkInfoProxy,
                    set: v => (onLinkInfoA = v),
                    configurable: true
                });
                Object.defineProperty(sessionController, dest.name, {
                    get: createDestinationProxy,
                    set: v => (onLinkDestinationA = v),
                    configurable: true
                });
            } catch (e) {}
        };

        const checkController = (target, prop, value) => {
            if (value &&
                typeof value === 'object' &&
                getFunction(value).fn &&
                getFunction(value, map.onLI).fn &&
                getFunction(value, map.onLD).fn &&
                !sessionController) {
                sessionController = value;
                if (debug) console.log('[Debug] Controller detected');
                setupProxies();
            }
            return Reflect.set(target, prop, value);
        };

        const createComponentProxy = (comp) => new Proxy(comp, {
            construct(target, args) {
                const instance = Reflect.construct(target, args);
                if (instance.$$.ctx) {
                    instance.$$.ctx = new Proxy(instance.$$.ctx, { set: checkController });
                }
                return instance;
            }
        });

        const createNodeProxy = (node) => async (...args) => {
            const result = await node(...args);
            return new Proxy(result, {
                get: (t, p) => p === 'component' ? createComponentProxy(t.component) : Reflect.get(t, p)
            });
        };

        const createKitProxy = (kit) => {
            if (!kit?.start) return [false, kit];
            return [true, new Proxy(kit, {
                get(target, prop) {
                    if (prop === 'start') {
                        return function(...args) {
                            const [nodes, , opts] = args;
                            if (nodes?.nodes && opts?.node_ids) {
                                const idx = opts.node_ids[1];
                                if (nodes.nodes[idx]) {
                                    nodes.nodes[idx] = createNodeProxy(nodes.nodes[idx]);
                                }
                            }
                            return kit.start.apply(this, args);
                        };
                    }
                    return Reflect.get(target, prop);
                }
            })];
        };

        const origPromiseAll = unsafeWindow.Promise.all;
        let intercepted = false;

        unsafeWindow.Promise.all = async function(promises) {
            const result = origPromiseAll.call(this, promises);
            if (!intercepted) {
                intercepted = true;
                return await new Promise((resolve) => {
                    result.then(([kit, app, ...args]) => {
                        const [success, created] = createKitProxy(kit);
                        if (success) {
                            unsafeWindow.Promise.all = origPromiseAll;
                        }
                        resolve([created, app, ...args]);
                    });
                });
            }
            return await result;
        };

        new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains("adsbygoogle")) {
                            node.remove();
                        }
                        node.querySelectorAll?.('.adsbygoogle, [id*=ad], [id*=container]').forEach(el => el.remove());
                        if (node.matches('.button.large.accessBtn.pos-relative.svelte-bv7qlp') && 
                            node.textContent.includes('Go To Destination')) {
                            triggerBypass('gtd');
                        }
                    }
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }
})();
