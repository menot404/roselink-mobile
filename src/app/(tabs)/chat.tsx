import { ComingSoon } from "@/components/ui/coming-soon";
import {MessageCircleHeart} from "lucide-react-native";

export default function Chat() {
  return (
    <ComingSoon
      title="Chat"
      icon={MessageCircleHeart}
      subtitle="Pose tes questions, sans jugement."
      description="L'assistante RoseLink sera disponible ici."
    />
  );
}