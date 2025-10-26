(function () {
    'use strict';

    const host = location.hostname;
    const debug = true;

    // Headers
    const t = {
        title: "Volcano Bypasser",
        pleaseSolveCaptcha: "Solve the CAPTCHA to continue",
        captchaSuccess: "CAPTCHA solved",
        redirectingToWork: "Redirecting to Work.ink...",
        bypassSuccessCopy: "Success! Key copied (click 'Allow' if prompted)",
        bypassSuccess: "Success! Waiting {time}s...",
        backToCheckpoint: "Back to checkpoint...",
        captchaSuccessBypassing: "CAPTCHA solved, bypassing...",
        version: "v1.0",
        madeBy: "by Berlin"
    };

    // Bypass Panel (UI)
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
                    position: fixed; top: 20px; right: 20px; width: 360px;
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
                }
                .panel {
                    background: #0a0a0f;
                    border-radius: 12px;
                    border: 1px solid #1a1a24;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 18px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .title {
                    font-size: 15px; 
                    font-weight: 600; 
                    color: #fff;
                    letter-spacing: 0.3px;
                }
                .minimize-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: #fff;
                    width: 26px; height: 26px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px; 
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .minimize-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.05);
                }
                .status-section {
                    padding: 16px 20px;
                }
                .status-box {
                    background: #12121a;
                    border: 1px solid #1a1a24;
                    border-radius: 8px;
                    padding: 14px 16px;
                }
                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .status-dot {
                    width: 8px; 
                    height: 8px;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                    flex-shrink: 0;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.15); }
                }
                .status-dot.info { background: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
                .status-dot.success { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
                .status-dot.warning { background: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
                .status-dot.error { background: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
                .status-text {
                    color: #e5e5e7;
                    font-size: 13px;
                    font-weight: 400;
                    flex: 1;
                    line-height: 1.5;
                }
                .panel-body {
                    max-height: 500px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    opacity: 1;
                }
                .panel-body.hidden {
                    max-height: 0;
                    opacity: 0;
                }
                .info-section {
                    padding: 12px 20px;
                    background: #08080d;
                    border-top: 1px solid #1a1a24;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .version, .credit {
                    color: #6b6b7a;
                    font-size: 11px;
                    font-weight: 400;
                }
                @media (max-width: 480px) {
                    .panel-container {
                        top: 10px; right: 10px; left: 10px; width: auto;
                    }
                }
                </style>
                <div class="panel-container">
                    <div class="panel">
                        <div class="header">
                            <div class="title">${t.title}</div>
                            <button class="minimize-btn" id="btn">−</button>
                        </div>
                        <div class="panel-body" id="body">
                            <div class="status-section">
                                <div class="status-box">
                                    <div class="status-content">
                                        <div class="status-dot info" id="dot"></div>
                                        <div class="status-text" id="text">${t.pleaseSolveCaptcha}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="info-section">
                                <div class="version">${t.version}</div>
                                <div class="credit">${t.madeBy}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.statusText = shadow.getElementById('text');
            this.statusDot = shadow.getElementById('dot');
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
            this.statusDot.className = `status-dot ${type}`;
        }
    }

    const panel = new BypassPanel();

    // Handler for VOLCANO
    if (host.includes("key.volcano.wtf")) {
        if (debug) console.log('[Debug] Waiting Captcha');

        let continueClicked = false;
        let copyClicked = false;

        const actOnCheckpoint = (node) => {
            if (!continueClicked) {
                const btns = (node?.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]'));

                for (const btn of btns) {
                    const text = (btn.innerText || btn.value || '').trim().toLowerCase();
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

            if (copyBtn && !copyClicked) {
                copyClicked = true;
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
                        if (node.nodeType === 1 && actOnCheckpoint(node)) {
                            if (copyClicked) {
                                mo.disconnect();
                                return;
                            }
                        }
                    }
                } else if (m.type === 'attributes' && m.target.nodeType === 1) {
                    if (actOnCheckpoint(m.target)) {
                        if (copyClicked) {
                            mo.disconnect();
                            return;
                        }
                    }
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

    // Handler for WORK.INK - Using working logic from second script
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
                for (let i = 0; i < candidates.length; i++) {
                    const name = candidates[i];
                    if (typeof obj[name] === "function") return { fn: obj[name], index: i, name };
                }
            } else {
                for (const i in obj) {
                    if (typeof obj[i] === "function" && obj[i].length === 2) {
                        return { fn: obj[i], name: i };
                    }
                }
            }
            return { fn: null, index: -1, name: null };
        };

        const spoofAllTasks = () => {
            if (!sessionController?.linkInfo) return;
            if (debug) console.log('[Debug] Spoofing all tasks');

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
            const result = sendMessageA ? sendMessageA.apply(this, a) : undefined;

            // Intelligent Spammer Logic
            if (!bypassTriggered && sessionController?.linkInfo && msgType === types.tr) {
                bypassTriggered = true;
                panel.show('captchaSuccessBypassing', 'success');
                if (debug) console.log('[Debug] CAPTCHA success! Starting intelligent spammer sequence');

                // Phase 1: Initial 5x burst
                if (debug) console.log('[Debug] Phase 1: Firing initial 5x spoof burst');
                for (let i = 1; i <= 5; i++) spoofAllTasks();

                // Phase 2: Fallback timer
                setTimeout(() => {
                    const dest = getFunction(sessionController, map.onLD);
                    if (dest.fn) {
                        if (debug) console.log('[Debug] Phase 2: 5s passed with no link. Firing fallback burst');
                        for (let i = 1; i <= 5; i++) spoofAllTasks();
                    }
                }, 5000);
            }
            return result;
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
            if (debug) console.log('[Debug] SUCCESS: Destination data received!', data);

            // Kill Switch - prevents multiple redirects
            const dest = getFunction(sessionController, map.onLD);
            if (dest.fn) {
                if (debug) console.log('[Debug] Kill Switch: Deactivating destination listener');
                Object.defineProperty(sessionController, dest.name, {
                    value: () => { if (debug) console.log('[Debug] Subsequent destination ignored'); },
                    writable: true,
                    configurable: true
                });
            }

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
                    }
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }
})();
