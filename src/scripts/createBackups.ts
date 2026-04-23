import fs from 'fs';
import path from 'path';
import { getBackupPath, BACKUP_DIRECTORY } from '../utils/helpers';
import {
  getProjects, getInstitutions, getInstitutionOverview, getProjectOverview,
  getLatestOSPoolOverview, getInstitutionsOverview, getDateOfLatestData
} from '../utils/adstash';

async function buildBackupMap() {
  const recordEnd = await getDateOfLatestData();
  if (!recordEnd) throw new Error('recordEnd was undefined');

  return [
    { function: getLatestOSPoolOverview, args: [] },
    { function: getDateOfLatestData, args: [] },
    { function: getProjects, args: [] },
    { function: getInstitutions, args: [] },
    { function: getInstitutionsOverview, args: [] },
    ...(Object.values(await getProjects()).map(p => ({ function: getProjectOverview, args: [p.projectName] }))),
    ...(Object.values(await getInstitutions()).map(i => ({ function: getInstitutionOverview, args: [i.institutionName] }))),
  ];
}

async function fetchBackup(fetcher: (...args: any[]) => Promise<any>, ...args: any[]) {
  const data = await fetcher(...args);
  const backupData = { data, date: new Date().toISOString() };
  
  const fileName = getBackupPath(fetcher, args);
  const backupFilePath = path.join(BACKUP_DIRECTORY, fileName);

  fs.mkdirSync(path.dirname(backupFilePath), { recursive: true });
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
}

async function main() {
  const tasks = await buildBackupMap();
  const BATCH_SIZE = 10;
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    await Promise.all(tasks.slice(i, i + BATCH_SIZE).map(t => fetchBackup(t.function, ...(t.args || []))));
    console.log(`Batch ${i / BATCH_SIZE + 1} of ${Math.ceil(tasks.length / BATCH_SIZE)} done`);
  }
}

main();