import {
  Box, Card, CardContent, Chip, IconButton, Link, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { addSpacesToUnderscores } from "@/src/utils/helpers";
import type { CacheStats } from ".";
import { CHOICES } from "./constants";

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "ok": return "success"
    case "error":
    case "critical": return "error"
    default: return "warning"
  }
}

const formatArea = (km2: number) => `${(km2 / 1e6).toFixed(1)}M km²`

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{label}</Typography>
      <Typography variant="body2" sx={{ textAlign: "right", overflowWrap: "anywhere" }}>{children}</Typography>
    </Box>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, flexShrink: 0 }}>
      <CardContent sx={{ p: "12px !important" }}>
        <Typography color="secondary.main" variant="subtitle1" fontWeight={600} gutterBottom>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  )
}

type CacheDetailsProps = {
  stats: CacheStats
  landArea: number
  color: string
  generatedAt: string
  onClose: () => void
}

export default function CacheDetails({ stats, landArea, color, generatedAt, onClose }: CacheDetailsProps) {
  const { cache } = stats

  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        boxSizing: "border-box",

        top: 16,
        right: 16,
        bottom: 16,
        width: 400 - 16,
        borderRadius: 3,
        p: 2,

        // Above the logos in the bottom right
        zIndex: 9200,

        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowY: "auto",
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <Box sx={{ width: 14, height: 14, mt: 1, borderRadius: "50%", flexShrink: 0, bgcolor: color }} />
        <Typography variant="h5" sx={{ flexGrow: 1, minWidth: 0, textWrap: "balance" }}>
          {addSpacesToUnderscores(cache.name)}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close cache details">
          <Close />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, mb: 1 }}>
        <Chip size="small" label={`Health: ${cache.healthStatus}`} color={statusColor(cache.healthStatus)} />
        <Chip size="small" label={`Status: ${cache.serverStatus}`} color={statusColor(cache.serverStatus)} variant="outlined" />
        {cache.version && <Chip size="small" label={`v${cache.version}`} variant="outlined" />}
        {cache.filtered && <Chip size="small" label={cache.filteredType || "Filtered"} color="warning" variant="outlined" />}
      </Stack>

      <Section title="Where it is chosen">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>Choice</TableCell>
              <TableCell align="right">Locations</TableCell>
              <TableCell align="right" sx={{ pr: 0 }}>Land area</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CHOICES.map((choice, i) => (
              <TableRow key={choice.label} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ pl: 0 }}>{choice.label}</TableCell>
                <TableCell align="right">{stats.points[i]}</TableCell>
                <TableCell align="right" sx={{ pr: 0 }}>
                  {stats.points[i] ? `${formatArea(stats.areas[i])} · ${(stats.areas[i] / landArea * 100).toFixed(1)}%` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Server">
        <Field label="Host">{new URL(cache.url).host}</Field>
        {cache.webUrl && (
          <Field label="Web UI">
            <Link href={cache.webUrl} target="_blank" rel="noopener noreferrer">{new URL(cache.webUrl).host}</Link>
          </Field>
        )}
        <Field label="Location">{cache.latitude.toFixed(4)}, {cache.longitude.toFixed(4)}</Field>
        <Field label="IO load">{cache.ioLoad.toFixed(2)}</Field>
      </Section>

      <Section title={`Namespaces (${cache.namespacePrefixes.length})`}>
        <Box sx={{
          maxHeight: 240,
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: 12,
          lineHeight: 1.7,
        }}>
          {cache.namespacePrefixes.length
            ? cache.namespacePrefixes.map(x => <div key={x}>{x}</div>)
            : <Typography variant="body2" color="text.secondary">None advertised</Typography>}
        </Box>
      </Section>

      <Typography align="center" variant="subtitle2" fontStyle="italic" sx={{ mt: 0.5 }}>
        Director snapshot from {new Date(generatedAt).toLocaleString()}
      </Typography>
    </Paper>
  )
}
