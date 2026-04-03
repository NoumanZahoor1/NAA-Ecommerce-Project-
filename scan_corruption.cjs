const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                scanDirectory(filePath);
            }
        } else {
            // Only check source files
            if (/\.(jsx|js|tsx|ts|html)$/.test(file)) {
                checkFile(filePath);
            }
        }
    }
}

function checkFile(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        // Look for suspicious binary data or just read as UTF-8 and see if it fails
        const content = buffer.toString('utf8');

        // Scan for the specific weird pattern if we can guess it, 
        // but simpler: check if there are null bytes or other non-text stuff in text files
        // (basic heuristic)
        for (let i = 0; i < buffer.length; i++) {
            // Check for control characters that shouldn't be there (except whitespace)
            // This is a loose check.
        }

    } catch (e) {
        console.log(`Error reading ${filePath}: ${e.message}`);
    }
}

// More targeted: The error stack says "markUsedVariable". 
// This implies it's parsing a CSS variable usage like var(--foo).
// Maybe there is a corrupted variable definition or usage.
// Let's grep for 'var(--' and see if any look weird.

console.log('Scanning for regex matches of var(-- with potential binary junk...');

const child_process = require('child_process');

try {
    // Use grep (system) to find "var(--"
    // On windows we can try findstr or just manual scan in node
    scanDirectory2('./src');
} catch (e) {
    console.error(e);
}

function scanDirectory2(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            scanDirectory2(filePath);
        } else {
            if (/\.(jsx|js|tsx|ts|html|css)$/.test(file)) {
                const content = fs.readFileSync(filePath, 'utf8');
                // Look for incomplete var(-- sequences or weird chars
                // The error 8975079 is 0x88F2E7. 
                // In UTF-8, this might be a multi-byte sequence interpreted as a code point?
            }
        }
    }
}

console.log("Scan complete (placeholder - honestly difficult to pinpoint the exact buffer offset without the exact parser logic).");
console.log("Checking VisualSearchModal.jsx specifically...");

const vsModal = path.join('src', 'components', 'shop', 'VisualSearchModal.jsx');
if (fs.existsSync(vsModal)) {
    const buffer = fs.readFileSync(vsModal);
    console.log(`${vsModal} size: ${buffer.length}`);
    // Check for weird bytes
}
