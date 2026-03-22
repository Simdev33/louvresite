const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('page.tsx')) results.push(file);
        }
    });
    return results;
}

const adminDir = path.join(__dirname, 'app', 'admin');
const files = walk(adminDir);

files.forEach(file => {
    // skip the newly created tracking page since it already has it
    if (file.includes('tracking\\page.tsx')) return;

    let content = fs.readFileSync(file, 'utf8');

    // Check if it already has tracking to avoid duplicates
    if (content.includes('href="/admin/tracking"')) return;

    const targetString = `<Link href="/admin/guide" className={styles.menuItem}>Guide</Link>`;
    const replacementString = `<Link href="/admin/guide" className={styles.menuItem}>Guide</Link>\n            <Link href="/admin/tracking" className={styles.menuItem}>Tracking</Link>`;

    if (content.includes(targetString)) {
        content = content.replace(targetString, replacementString);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});
console.log('Done.');
