export interface IIdea {
  id?: string;
  idee?: string | null;
  theme?: string | null;
  piste?: string | null;
  niveau?: string | null;
}

export class Idea implements IIdea {
  constructor(
    public id?: string,
    public idee?: string | null,
    public theme?: string | null,
    public piste?: string | null,
    public niveau?: string | null
  ) {}
}

export function getIdeaIdentifier(idea: IIdea): string | undefined {
  return idea.id;
}
