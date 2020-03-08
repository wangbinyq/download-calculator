import bytes from "bytes";

export interface DownloadItem {
  id: string,
  name: string,
  size: string,
  download: string,
  speed: string,
  edit: DownloadItem | null,
}

export function progress (item: DownloadItem): number {
  const { size, download } = item
  return bytes.parse(download) / bytes.parse(size) * 100
}

export function remainTime (item: DownloadItem): number {
  const { size, download, speed } = item
  const nsize = bytes.parse(size)
  const ndownload = bytes.parse(download)
  const nspeed = bytes.parse(speed)

  return (nsize - ndownload) / nspeed
}

export function makeDownalodItem(): DownloadItem {
  const item: DownloadItem = {
    id: `${Math.random()}`,
    name: '',
    size: '100MB',
    download: '0MB',
    speed: '128KB',
    edit: null,
  }

  item.edit = item;

  return item;
}