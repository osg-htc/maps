import BaseMap from "@/src/components/BaseMap";
import ProvidersMap from "@/src/app/tennessee/_components/ProvidersMap";

export default async function ProvidersPage() {
  return (
    <BaseMap>
      <ProvidersMap></ProvidersMap>
    </BaseMap>
  );
}
