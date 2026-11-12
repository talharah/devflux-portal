// Tab Navigation Switcher
function switchTool(toolId) {
    // Hide all tool containers
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
    
    // Reset tab styles
    document.querySelectorAll('.tool-tab').forEach(el => {
        el.classList.remove('bg-brand-500', 'text-slate-950', 'font-semibold', 'shadow-lg', 'shadow-brand-500/20');
        el.classList.add('text-slate-400', 'hover:text-slate-200', 'hover:bg-slate-800');
    });

    // Show selected container
    document.getElementById('tool-' + toolId).classList.remove('hidden');

    // Highlight active tab
    const activeTab = document.getElementById('tab-' + toolId);
    activeTab.classList.remove('text-slate-400', 'hover:text-slate-200', 'hover:bg-slate-800');
    activeTab.classList.add('bg-brand-500', 'text-slate-950', 'font-semibold', 'shadow-lg', 'shadow-brand-500/20');

    // Trigger defaults for specific tools
    if(toolId === 'password') generatePassword();
    if(toolId === 'uuid') generateUUID();
}

// Notification Helper
function showToast(msg, isError) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.toggle('bg-emerald-600', !isError);
    toast.classList.toggle('bg-red-600', !!isError);
    toast.classList.remove('hidden');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => toast.classList.add('hidden'), isError ? 4500 : 2500);
}
function showError(msg) { showToast(msg, true); }

// Copy Helper
async function copyValue(txt) {
    if (!txt) return;
    try {
        await navigator.clipboard.writeText(txt);
    } catch (e) {
        const t = document.createElement('textarea');
        t.value = txt;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
    }
    showToast('Copied to clipboard!');
}
function copyToClipboard(id) { copyValue(document.getElementById(id).value); }
function copyText(id) { copyValue(document.getElementById(id).innerText); }

// Clear Helper
function clearField(inputId, outputId) {
    document.getElementById(inputId).value = '';
    document.getElementById(outputId).value = '';
}

// Download Helper
function downloadFile(elementId, filename, type) {
    const content = document.getElementById(elementId).value;
    if (!content) return;
    const blob = new Blob([type === 'text/csv' ? '\uFEFF' + content : content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 1. JSON to CSV Logic
function csvCell(val) {
    const isStr = typeof val === 'string';
    if (val === undefined || val === null) val = '';
    else if (typeof val === 'object') val = JSON.stringify(val);
    let str = String(val);
    // Prevent CSV/formula injection in Excel & Sheets
    if (isStr && /^[=+\-@\t\r]/.test(str) && isNaN(Number(str))) str = "'" + str;
    return '"' + str.replace(/"/g, '""') + '"';
}

function convertJsonToCsv() {
    const input = document.getElementById('jsonCsvInput').value.trim();
    if (!input) {
        showError('Please enter valid JSON array data.');
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(input);
    } catch (err) {
        showError('Invalid JSON Syntax: ' + err.message);
        return;
    }
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
        showError('JSON input must be a non-empty array of objects.');
        return;
    }
    if (parsedData.some(r => r === null || typeof r !== 'object' || Array.isArray(r))) {
        showError('Every item in the array must be an object, e.g. {"name": "Alice"}.');
        return;
    }

    const headers = Array.from(new Set(parsedData.flatMap(obj => Object.keys(obj))));
    const csvRows = [headers.map(csvCell).join(',')];
    for (const row of parsedData) {
        csvRows.push(headers.map(h => csvCell(row[h])).join(','));
    }
    document.getElementById('csvOutput').value = csvRows.join('\n');
}

function loadSampleJSON() {
    const sample = [
        { "id": 101, "name": "Talha Rahman", "role": "Software Engineer", "status": "Active" },
        { "id": 102, "name": "Sarah Connor", "role": "DevOps Architect", "status": "Pending" },
        { "id": 103, "name": "Alex Mercer", "role": "UI/UX Designer", "status": "Active" }
    ];
    document.getElementById('jsonCsvInput').value = JSON.stringify(sample, null, 2);
}

// 2. JSON Formatter & Minifier Logic
function formatJson(indent) {
    const input = document.getElementById('jsonFormatInput').value.trim();
    if(!input) return;
    try {
        const obj = JSON.parse(input);
        document.getElementById('jsonFormatOutput').value = JSON.stringify(obj, null, indent);
    } catch (err) {
        showError('Invalid JSON: ' + err.message);
    }
}

function minifyJson() {
    const input = document.getElementById('jsonFormatInput').value.trim();
    if(!input) return;
    try {
        const obj = JSON.parse(input);
        document.getElementById('jsonFormatOutput').value = JSON.stringify(obj);
    } catch (err) {
        showError('Invalid JSON: ' + err.message);
    }
}

function loadSampleRawJson() {
    document.getElementById('jsonFormatInput').value = '{"project":"DevText Studio","version":1.0,"features":["JSON to CSV","Base64","Password Gen"],"isPrivate":true}';
}

// 3. Base64 Encoder/Decoder
function base64EncodeUnicode(str) {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

function base64DecodeUnicode(str) {
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function processBase64(mode) {
    const input = document.getElementById('base64Input').value;
    if(!input) return;
    try {
        if (mode === 'encode') {
            document.getElementById('base64Output').value = base64EncodeUnicode(input);
        } else {
            const normalized = input.replace(/\s+/g, '');
            if (!normalized) {
                document.getElementById('base64Output').value = '';
                return;
            }
            if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(normalized)) {
                throw new Error('The input is not valid Base64.');
            }
            document.getElementById('base64Output').value = base64DecodeUnicode(normalized);
        }
    } catch (err) {
        showError('Error processing Base64: ' + err.message);
    }
}

// 4. URL Slug Generator
function generateSlug() {
    const txt = document.getElementById('slugInput').value;
    const slug = txt
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    document.getElementById('slugOutput').value = slug;
}

// 5. Case Converter
function convertCases() {
    const txt = document.getElementById('caseInput').value;
    if (!txt) {
        document.getElementById('camelCaseOut').innerText = '';
        document.getElementById('snakeCaseOut').innerText = '';
        document.getElementById('kebabCaseOut').innerText = '';
        document.getElementById('pascalCaseOut').innerText = '';
        return;
    }

    const words = txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);

    // camelCase
    const camel = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    // snake_case
    const snake = words.map(w => w.toLowerCase()).join('_');
    // kebab-case
    const kebab = words.map(w => w.toLowerCase()).join('-');
    // PascalCase
    const pascal = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');

    document.getElementById('camelCaseOut').innerText = camel;
    document.getElementById('snakeCaseOut').innerText = snake;
    document.getElementById('kebabCaseOut').innerText = kebab;
    document.getElementById('pascalCaseOut').innerText = pascal;
}

// 6. Password Generator
function randInt(max) {
    const cryptoApi = window.crypto || globalThis.crypto;
    if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
        throw new Error('This browser does not support secure random generation.');
    }

    const limit = Math.floor(4294967296 / max) * max;
    const buf = new Uint32Array(1);
    do { cryptoApi.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % max;
}

function generatePassword() {
    const length = Number(document.getElementById('passLength').value);
    if (!Number.isInteger(length) || length < 1 || length > 64) {
        document.getElementById('passOutput').value = 'Password length must be between 1 and 64.';
        return;
    }

    const sets = [];
    if (document.getElementById('chkUpper').checked) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (document.getElementById('chkLower').checked) sets.push('abcdefghijklmnopqrstuvwxyz');
    if (document.getElementById('chkNums').checked) sets.push('0123456789');
    if (document.getElementById('chkSymbols').checked) sets.push('!@#$%^&*()_+-=[]{}|;:,.<>?');

    if (!sets.length) {
        document.getElementById('passOutput').value = 'Select at least 1 option';
        return;
    }
    const all = sets.join('');
    const chars = sets.map(set => set[randInt(set.length)]); // one from each selected type
    while (chars.length < length) chars.push(all[randInt(all.length)]);
    for (let i = chars.length - 1; i > 0; i--) { // Fisher-Yates shuffle
        const j = randInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    document.getElementById('passOutput').value = chars.slice(0, length).join('');
}

// 7. UUID Generator (v4)
function generateUUID() {
    const cryptoApi = window.crypto || globalThis.crypto;
    if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
        showError('UUID generation requires secure browser support.');
        return;
    }

    const uuid = (cryptoApi.randomUUID ? cryptoApi.randomUUID() :
        ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ cryptoApi.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)));
    document.getElementById('uuidOutput').value = uuid;
}
    

// 8. JWT Decoder
function b64urlDecode(str) {
    if (typeof str !== 'string' || !str.trim()) return '';
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function decodeJwt() {
    const token = document.getElementById('jwtInput').value.trim();
    if (!token) return;
    const parts = token.split('.');
    if (parts.length < 2 || parts.length > 3) {
        showError('A JWT has 2 or 3 parts separated by dots.');
        return;
    }
    try {
        const header = JSON.parse(b64urlDecode(parts[0]));
        const payload = JSON.parse(b64urlDecode(parts[1]));
        let out = '// HEADER\n' + JSON.stringify(header, null, 2) + '\n\n// PAYLOAD\n' + JSON.stringify(payload, null, 2);
        const notes = [];
        ['iat', 'nbf', 'exp'].forEach(k => {
            if (typeof payload[k] === 'number') notes.push(k + ': ' + new Date(payload[k] * 1000).toISOString());
        });
        if (typeof payload.exp === 'number') notes.push(payload.exp * 1000 < Date.now() ? 'Status: EXPIRED' : 'Status: not expired');
        if (notes.length) out += '\n\n// TIMES\n' + notes.join('\n');
        out += '\n\n// Signature is NOT verified.';
        document.getElementById('jwtOutput').value = out;
    } catch (err) {
        showError('Invalid JWT: ' + err.message);
    }
}

// 9. SHA Hash Generator
async function generateHash() {
    const txt = document.getElementById('hashInput').value;
    if (!txt) return;
    if (!window.crypto || !crypto.subtle) {
        showError('Hashing needs a secure page (HTTPS or localhost).');
        return;
    }
    const data = new TextEncoder().encode(txt);
    const lines = [];
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
        const buf = await crypto.subtle.digest(algo, data);
        lines.push(algo + ':\n' + Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join(''));
    }
    document.getElementById('hashOutput').value = lines.join('\n\n');
}
