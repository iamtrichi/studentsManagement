export interface IAppreciations {
  id?: string;
  appreciationIdentifier?: string;
}

export class Appreciations implements IAppreciations {
  constructor(public id?: string, public appreciationIdentifier?: string) {}
}

export function getAppreciationsIdentifier(appreciations: IAppreciations): string | undefined {
  return appreciations.id;
}
