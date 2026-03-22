import fs from 'fs/promises';

const files = [
  'app/api/admin/about/route.ts',
  'app/api/admin/company/route.ts',
  'app/api/admin/disclaimer/route.ts',
  'app/api/admin/disclaimer-site/route.ts',
  'app/api/admin/faq/route.ts',
  'app/api/admin/guide/route.ts',
  'app/api/admin/privacy/route.ts',
  'app/api/admin/stripe/route.ts',
  'app/api/admin/terms/route.ts',
  'app/api/about/route.ts',
  'app/api/company/route.ts',
  'app/api/disclaimer/route.ts',
  'app/api/disclaimer-site/route.ts',
  'app/api/faq/route.ts',
  'app/api/guide/route.ts',
  'app/api/privacy/route.ts',
  'app/api/terms/route.ts'
];

async function run() {
  for (const file of files) {
    try {
      let text = await fs.readFile(file, 'utf8');
      
      let idMatch = text.match(/(?:DATA_PATH|dataFile).*?['"](.*?)(\.json)['"]/);
      if (!idMatch) {
          console.log("No match: " + file);
          continue;
      }
      let id = idMatch[1].split("'").pop().split('"').pop();

      if (!text.includes('@/lib/supabase')) {
        text = text.replace(/import { NextResponse } from 'next\/server';/, "import { NextResponse } from 'next/server';\nimport { supabase } from '@/lib/supabase';");
      }

      text = text.replace(/import \{.*\} from 'fs';\n/g, '');
      text = text.replace(/import .* from 'fs\/promises';\n/g, '');
      text = text.replace(/import \{ promises as fs \} from 'fs';\n/g, '');

      if (text.includes('load')) {
        text = text.replace(/function load([a-zA-Z0-9_]+)\s*\([^)]*\)(:\s*[^\{]+)?\s*\{[\s\S]*?(?=\n(?:function load|function save|export async|const|let|var|$)|\n\n)/g, (match, name, ret) => {
            let fallback = "{}";
            if ((ret && ret.includes('[]')) || match.includes('return [];')) fallback = "[]";
            let newRet = ret ? `: Promise<${ret.substring(1).trim()}>` : '';
            return `async function load${name}()${newRet} {\n    const { data: row } = await supabase.from('site_data').select('data').eq('id', '${id}').single();\n    return row?.data || ${fallback};\n}`;
        });

        text = text.replace(/function save([a-zA-Z0-9_]+)\s*\(([^)]+)\)[^{]*\{[\s\S]*?(?=\n(?:function load|function save|export async|const|let|var|$)|\n\n)/g, (match, name, args) => {
            let dataVar = args.split(':')[0].trim();
            return `async function save${name}(${args}) {\n    const { error } = await supabase.from('site_data').upsert({ id: '${id}', data: ${dataVar} });\n    if (error) console.error('Error saving:', error);\n}`;
        });

        text = text.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*load([a-zA-Z0-9_]+)\(\);/g, 'const $1 = await load$2();');
        text = text.replace(/save([a-zA-Z0-9_]+)\(([^)]+)\);/g, 'await save$1($2);');
      } else {
        text = text.replace(/const fileContents = await fs\.readFile.*?\n\s+const data = JSON\.parse\(fileContents\);/g, `const { data: row } = await supabase.from('site_data').select('data').eq('id', '${id}').single();\n        const data = row?.data || {};`);
        text = text.replace(/await fs\.writeFile.*?(;|(?=\n))/g, `await supabase.from('site_data').upsert({ id: '${id}', data });`);
      }

      text = text.replace(/const (DATA_PATH|dataFile).*?;\n/g, '');
      text = text.replace(/import path from 'path';\n/g, '');

      await fs.writeFile(file, text, 'utf8');
      console.log("Rewrote " + file);
    } catch(e) {
      console.log("Error in " + file + ":", e.message);
    }
  }
}
run();
