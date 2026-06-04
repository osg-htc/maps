import { Card, CardContent, Typography } from "@mui/material";

export default function StatisticsCard({title, content}: {title: string, content: string}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: "12px !important" }}>
        <Typography lineHeight={1} color="secondary.main" align='center' variant="h6">{title}</Typography>
        <Typography color="primary.main" align='center' variant="h3">{content}</Typography>
      </CardContent>
    </Card>
  )
}