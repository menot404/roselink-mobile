import { ComingSoon } from "@/components/ui/coming-soon";
import {MapPin} from "lucide-react-native";

export default function Carte() {
  return (
    <ComingSoon
      title="Centres de dépistage"
      icon={MapPin}
      subtitle="Trouve où aller."
      description="La liste des centres les plus proches de toi, avec leurs services, apparaîtra ici."
    />
  );
}