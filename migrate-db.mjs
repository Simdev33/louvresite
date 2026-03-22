import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    console.log(`Found ${files.length} files to migrate.`);
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const id = file.replace('.json', '');
        const content = await fs.readFile(path.join(dataDir, file), 'utf8');
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch(e) {
            console.error(`Invalid JSON in ${file}`);
            continue;
        }

        const { error } = await supabase
            .from('site_data')
            .upsert({ id, data: parsed });

        if (error) {
            console.error(`Error migrating ${file}:`, error.message);
        } else {
            console.log(`Migrated ${id}`);
        }
    }
    console.log("Migration complete.");
}

migrate();
