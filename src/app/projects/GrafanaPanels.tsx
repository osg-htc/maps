import React from 'react';
import { Box } from '@mui/material';
import { sub } from 'date-fns';
import { ProjectWithESData, ProjectWithESData } from '../types/mapTypes';

type GrafanaPanelProps = {
  panelId: number;
  panelUrl: string;
  start: number;
  end: number;
  orgId: number;
  project: string;
};

const GrafanaPanel: React.FC<GrafanaPanelProps> = ({
  panelId,
  panelUrl,
  start,
  end,
  orgId,
  project,
}) => {
  const encodedProject = encodeURIComponent(project); // Safely encode the project name
  const url = `${panelUrl}?to=${end}&from=${start}&orgId=${orgId}&panelId=${panelId}&var-Filter=ResourceType%7C%3D%7CPayload&var-Project=${encodedProject}`;
  return <iframe src={url} width='100%' height='250px' title='Faculty Panel' />;
};

const GrafanaPanels: React.FC<{ project: ProjectWithESData }> = ({ project }) => {
  // console.log('GpuHours:', project?.esData.gpuHours);
  const data = {
    panelId: [12, 10, 16, 4, 22],
    panelUrl: `https://gracc.opensciencegrid.org/d-solo/tFUN4y44z/projects`,
    start: sub(new Date(), { years: 1 }).getTime(),
    end: new Date().getTime(),
    orgId: 1,
  };

  return (
    <Box>
      <Box className='flex gap-2 flex-col lg-custom:flex-row my-2'>
        <GrafanaPanel // Facilities Running project's jobs
          panelId={12}
          panelUrl={data.panelUrl}
          start={data.start}
          end={data.end}
          orgId={data.orgId}
          project={project.Name}
        />
        <GrafanaPanel // Where the project running jobs
          panelId={10}
          panelUrl={data.panelUrl}
          start={data.start}
          end={data.end}
          orgId={data.orgId}
          project={project.Name}
        />
      </Box>
      {project.esData.gpuHours > 0 ? (
        <Box className='flex gap-2 flex-col lg-custom:flex-row my-2'>
          <GrafanaPanel // GPU Hours
            panelId={16}
            panelUrl={data.panelUrl}
            start={data.start}
            end={data.end}
            orgId={data.orgId}
            project={project.Name}
          />
        </Box>
      ) : null}
      <Box className='flex gap-2 flex-col lg-custom:flex-row my-2 '>
        {project.esData.cpuHours > 0 ? (
          <GrafanaPanel // CPU Hours
            panelId={4}
            panelUrl={data.panelUrl}
            start={data.start}
            end={data.end}
            orgId={data.orgId}
            project={project.Name}
          />
        ) : null}
        <GrafanaPanel // Jobs Ran by project
          panelId={22}
          panelUrl={data.panelUrl}
          start={data.start}
          end={data.end}
          orgId={data.orgId}
          project={project.Name}
        />
      </Box>
    </Box>
  );
};
export default GrafanaPanels;
