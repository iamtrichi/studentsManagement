export interface IProfiles {
  id?: string;
  profileIdentifier?: string;
}

export class Profiles implements IProfiles {
  constructor(public id?: string, public profileIdentifier?: string) {}
}

export function getProfilesIdentifier(profiles: IProfiles): string | undefined {
  return profiles.id;
}
