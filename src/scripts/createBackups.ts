import fs from 'fs';
import path from 'path';
import { getBackupPath, BACKUP_DIRECTORY } from '../utils/helpers';
import {
  getProjects, getInstitutions, getInstitutionOverview, getProjectOverview,
  getLatestOSPoolOverview, getInstitutionsOverview, getDateOfLatestData
} from '../utils/adstash';

async function fetchBackup<T extends unknown[], K>(
  fetcher: (...args: T) => Promise<K>,
  args: T
): Promise<void> {
  const data = await fetcher(...args);
  const backupData = { data, date: new Date().toISOString() };
  
  const fileName = getBackupPath(fetcher, args);
  const backupFilePath = path.join(BACKUP_DIRECTORY, fileName);

  fs.mkdirSync(path.dirname(backupFilePath), { recursive: true });
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
}

async function buildBackupMap(): Promise<(() => Promise<void>)[]> {
  const recordEnd = await getDateOfLatestData();
  if (!recordEnd) throw new Error('recordEnd was undefined');

  const projects = await getProjects();
  const institutions = await getInstitutions();

  return [
    () => fetchBackup(getLatestOSPoolOverview, []),
    () => fetchBackup(getDateOfLatestData, []),
    () => fetchBackup(getProjects, []),
    () => fetchBackup(getInstitutions, []),
    () => fetchBackup(getInstitutionsOverview, []),
    ...Object.values(projects).map(p => {
      const name = p.projectName ?? "";
      return () => fetchBackup(getProjectOverview, [name]);
    }),
    ...Object.values(institutions).map(i => {
      const name = i.institutionName ?? "";
      return () => fetchBackup(getInstitutionOverview, [name]);
    }),
  ];
}

async function main() {
  const tasks = await buildBackupMap();
  const BATCH_SIZE = 10;
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    await Promise.all(tasks.slice(i, i + BATCH_SIZE).map(t => t()));
    console.log(`Batch ${i / BATCH_SIZE + 1} of ${Math.ceil(tasks.length / BATCH_SIZE)} done`);
  }
}

main();