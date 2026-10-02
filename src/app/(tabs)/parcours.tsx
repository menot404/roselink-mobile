import { ComingSoon } from "@/components/ui/coming-soon";
import {Router} from "lucide-react-native";

export default function Parcours() {
  return (
    <ComingSoon
      title="Mon parcours"
      icon={Router}
      subtitle="Un contenu adapté à toi."
      description="Les signes d'alerte, le guide pour connaître ses seins et l'accompagnement apparaîtront ici."
    />
  );
}