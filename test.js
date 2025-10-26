(function () {
    'use strict';

    const host = location.hostname;
    const debug = true;

    // Headers
    const t = {
        title: "Volca2no Bypasser",
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
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                }
                .panel {
                    background: #0f0f14;
                    border-radius: 10px;
                    border: 1px solid #1f1f28;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .header {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .title {
                    font-size: 16px; 
                    font-weight: 600; 
                    color: #fff;
                }
                .minimize-btn {
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    color: #fff;
                    width: 28px; height: 28px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 18px; 
                    font-weight: 500;
                    transition: background 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .minimize-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
                .status-section {
                    padding: 18px 20px;
                }
                .status-box {
                    background: #16161d;
                    border: 1px solid #1f1f28;
                    border-radius: 8px;
                    padding: 14px 16px;
                }
                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .status-dot {
                    width: 10px; 
                    height: 10px;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                    flex-shrink: 0;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
                .status-dot.info { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
                .status-dot.success { background: #10b981; box-shadow: 0 0 8px #10b981; }
                .status-dot.warning { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
                .status-dot.error { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
                .status-text {
                    color: #e4e4e7;
                    font-size: 14px;
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
                    padding: 14px 20px;
                    background: #0a0a0f;
                    border-top: 1px solid #1f1f28;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .version, .credit {
                    color: #6b6b7a;
                    font-size: 12px;
                    font-weight: 400;
                    font-style: italic;
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

        let alreadyDoneContinue = false;
        let alreadyDoneCopy = false;

        const actOnCheckpoint = (node) => {
            if (!alreadyDoneContinue) {
                const btns = (node?.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]'));

                for (const btn of btns) {
                    const text = (btn.innerText || btn.value || '').trim().toLowerCase();
                    if ((text.includes("continue") || text.includes("next step"))) {
                        const disabled = btn.disabled || btn.getAttribute("aria-disabled") === "true";
                        const visible = btn.offsetParent !== null;
                        if (visible && !disabled) {
                            alreadyDoneContinue = true;
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
            }

            const copyBtn = (node?.nodeType === 1
                ? node.matches("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                    ? node
                    : node.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                : document.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']"));

            if (copyBtn && !alreadyDoneCopy) {
                alreadyDoneCopy = true;
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
                            if (alreadyDoneCopy) {
                                mo.disconnect();
                                return;
                            }
                        }
                    }
                } else if (m.type === 'attributes' && m.target.nodeType === 1) {
                    if (actOnCheckpoint(m.target)) {
                        if (alreadyDoneCopy) {
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

        if (actOnCheckpoint(document.documentElement) && alreadyDoneCopy) {
            mo.disconnect();
        }
    }

    // Handler for WORK.INK - Using the working logic from second code
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
                if (debug) console.log('[Debug] Phase 1: Initial 5x spoof burst');
                for (let i = 1; i <= 5; i++) spoofAllTasks();

                // Phase 2: Fallback timer
                setTimeout(() => {
                    const dest = getFunction(sessionController, map.onLD);
                    if (dest.fn) {
                        if (debug) console.log('[Debug] Phase 2: 5s fallback burst');
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

            // Kill Switch
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
