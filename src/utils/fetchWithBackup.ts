import { getBackupPath, BACKUP_URL_PATH } from './helpers';

export default async function fetchWithBackup<T>(
  fetcher: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<{
  data: T,
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
    const data = await response.json();
    return { data: data['data'], date: new Date(data['date']), fromBackup: true };
  }
}