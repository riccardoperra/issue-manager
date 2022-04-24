import { Project } from '../../data/projects.service';
import { Category } from '../../data/categories.service';
import { Card } from '../../data/cards.service';

export type ProjectKanbanPageModel = {
  projectId: string;
  project: Project;
  loading: boolean;
  categories: readonly Category[];
  cards: readonly Card[];
};
