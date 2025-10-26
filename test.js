(function () {
    'use strict';

    const host = location.hostname;
    const debug = true;

    // Headers
    const t = {
        title: "Volcano Bypasser",
        pleaseSolveCaptcha: "Solve the CAPTCHA to continue",
        captchaSuccess: "CAPTCHA solved successfully",
        redirectingToWork: "Redirecting to Work.ink...",
        bypassSuccessCopy: "Bypass successful! Key copied (click 'Allow' if prompted)",
        bypassSuccess: "Bypass successful, waiting {time}s...",
        backToCheckpoint: "Returning to checkpoint...",
        captchaSuccessBypassing: "CAPTCHA solved successfully, bypassing...",
        version: "Version 1.0",
        madeBy: "Made by Berlin"
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
                    position: fixed; top: 20px; right: 20px; width: 380px;
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                }
                .panel {
                    background: rgba(17, 17, 27, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(30px) translateY(-10px); }
                    to { opacity: 1; transform: translateX(0) translateY(0); }
                }
                .header {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
                    padding: 14px 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                }
                .title {
                    font-size: 15px; 
                    font-weight: 600; 
                    color: #fff;
                    letter-spacing: -0.01em;
                }
                .minimize-btn {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: rgba(255, 255, 255, 0.7);
                    width: 28px; height: 28px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px; 
                    font-weight: 400;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .minimize-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: #fff;
                }
                .minimize-btn:active {
                    transform: scale(0.95);
                }
                .status-section {
                    padding: 16px;
                }
                .status-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    padding: 12px 14px;
                }
                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .status-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                    flex-shrink: 0;
                    position: relative;
                }
                .status-dot::after {
                    content: '';
                    position: absolute;
                    inset: -3px;
                    border-radius: 50%;
                    background: currentColor;
                    opacity: 0.2;
                    animation: ripple 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                @keyframes ripple {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
                .status-dot.info { background: #3b82f6; color: #3b82f6; }
                .status-dot.success { background: #10b981; color: #10b981; }
                .status-dot.warning { background: #f59e0b; color: #f59e0b; }
                .status-dot.error { background: #ef4444; color: #ef4444; }
                .status-text {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 13px;
                    font-weight: 400;
                    flex: 1;
                    line-height: 1.5;
                    letter-spacing: -0.01em;
                }
                .panel-body {
                    max-height: 500px;
                    overflow: hidden;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 1;
                }
                .panel-body.hidden {
                    max-height: 0;
                    opacity: 0;
                }
                .info-section {
                    padding: 12px 18px;
                    background: rgba(0, 0, 0, 0.15);
                    border-top: 1px solid rgba(255, 255, 255, 0.04);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .version, .credit {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 11px;
                    font-weight: 400;
                    font-style: italic;
                    letter-spacing: 0.01em;
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
                            <button class="minimize-btn" id="btn">+</button>
                        </div>
                        <div class="status-section">
                            <div class="status-box">
                                <div class="status-content">
                                    <div class="status-dot info" id="dot"></div>
                                    <div class="status-text" id="text">${t.pleaseSolveCaptcha}</div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body hidden" id="body">
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
