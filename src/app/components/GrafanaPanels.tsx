import React from "react";
import { Box } from "@mui/material";
import { sub } from 'date-fns';

type GrafanaPanelProps = {
    panelId: number;
    panelUrl: string;
    start: number;
    end: number;
    orgId: number;
    project: string;
} 

const GrafanaPanel: React.FC<GrafanaPanelProps> = ({ panelId, panelUrl, start, end, orgId, project }) => {
    const url = `${panelUrl}?to=${end}&from=${start}&orgId=${orgId}&panelId=${panelId}&var-Project=${project}`;
    return (
        <iframe
        src={url}
        width="100%"
        height="250px"
        title="Faculty Panel" 
        />
    );
}

const GrafanaPanels: React.FC<{ project: string }> = ({ project }) => {
    
    const data = {
        panelId:[12, 10, 16, 4, 22],
        panelUrl: `https://gracc.opensciencegrid.org/d-solo/tFUN4y44z/projects`,
        start: sub(new Date(), { years: 1 }).getTime(),
        end: new Date().getTime(),
        orgId: 1
      }
    
    return (
        <Box>
            <Box className="flex gap-2 flex-col lg-custom:flex-row my-2">
                <GrafanaPanel
                    panelId={12}
                    panelUrl={data.panelUrl}
                    start={data.start}
                    end={data.end}
                    orgId={data.orgId}
                    project={project}
                />
                <GrafanaPanel
                    panelId={10}
                    panelUrl={data.panelUrl}
                    start={data.start}
                    end={data.end}
                    orgId={data.orgId}
                    project={project}
                />
            </Box>
            <Box className="flex gap-2 flex-col lg-custom:flex-row my-2">
                <GrafanaPanel
                    panelId={16}
                    panelUrl={data.panelUrl}
                    start={data.start}
                    end={data.end}
                    orgId={data.orgId}
                    project={project}
                />
            </Box>
            <Box className="flex gap-2 flex-col lg-custom:flex-row my-2 ">
                <GrafanaPanel
                    panelId={4}
                    panelUrl={data.panelUrl}
                    start={data.start}
                    end={data.end}
                    orgId={data.orgId}
                    project={project}
                />
                <GrafanaPanel
                    panelId={22}
                    panelUrl={data.panelUrl}
                    start={data.start}
                    end={data.end}
                    orgId={data.orgId}
                    project={project}
                />
            </Box>
        </Box>
    );
}
export default GrafanaPanels;