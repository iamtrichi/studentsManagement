export interface IFiles {
  id?: string;
  urlContentType?: string | null;
  url?: string | null;
  description?: string | null;
}

export class Files implements IFiles {
  constructor(public id?: string, public urlContentType?: string | null, public url?: string | null, public description?: string | null) {}
}

export function getFilesIdentifier(files: IFiles): string | undefined {
  return files.id;
}
