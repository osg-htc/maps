import { getBackupPath, BACKUP_URL_PATH } from './helpers';

export default async function fetchWithBackup<T extends unknown[], K>(
  fetcher: (...args: T) => Promise<K>,
  ...args: T
): Promise<{
  data: K,
  date: Date,
  fromBackup: boolean
}> {
  try {
    const data = await fetcher(...args);
    return { data, date: new Date(), fromBackup: false };
  } catch {
    const fileName = getBackupPath(fetcher, args);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const backupUrl = `${basePath}${BACKUP_URL_PATH}/${fileName}`;

    const response = await fetch(backupUrl);
    if (!response.ok) throw new Error(`Backup not found: ${response.statusText}`);

    const backup = (await response.json()) as { data: K, date: string };
    return { 
      data: backup.data, 
      date: new Date(backup.date), 
      fromBackup: true 
    };
  }
}