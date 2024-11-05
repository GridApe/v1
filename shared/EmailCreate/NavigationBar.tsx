import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationBarProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ showPreview, setShowPreview }) => {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-[#1E0E4E]">
              Create email
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="sm:flex hidden"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
