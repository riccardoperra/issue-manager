import { Component, OnInit, TrackByFunction } from '@angular/core';
import { ProjectsState } from '../../shared/state/projects.state';
import { tuiFadeIn } from '@taiga-ui/core';
import { Project } from '../../data/projects.service';

@Component({
  selector: 'app-projects-board',
  templateUrl: './projects-board.component.html',
  styleUrls: ['./projects-board.component.scss'],
  animations: [tuiFadeIn],
})
export class ProjectsBoardComponent implements OnInit {
  readonly projects$ = this.projectsState.projects$;

  readonly projectTrackBy: TrackByFunction<Project> = (index, { $id }) => $id;

  constructor(private readonly projectsState: ProjectsState) {}

  ngOnInit(): void {}
}
