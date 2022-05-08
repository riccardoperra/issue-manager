import { Project } from '../../data/projects.service';
import { Card } from '../../data/cards.service';
import { Models } from 'appwrite';
import { CardAttachment } from '../../data/cards-attachments.service';

export type UploadedAttachment = Models.File & {
  attachment: CardAttachment;
};

export interface KanbanCardEditorState {
  project: Project;
  card: Card;
  attachmentList: readonly UploadedAttachment[];
}
