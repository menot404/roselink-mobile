import { ComingSoon } from "@/components/ui/coming-soon";
import {HeartHandshake} from "lucide-react-native";

export default function Association() {
  return (
    <ComingSoon
      title="Association"
      icon={HeartHandshake}
      subtitle="Aide et soutien."
      description="Les associations partenaires et le formulaire de don apparaîtront ici."
    />
  );
}