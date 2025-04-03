
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SidebarLayout } from "@/components/SidebarLayout";
import Index from "@/pages/Index";
import ChapterOverview from "@/pages/ChapterOverview";
import TopicContent from "@/pages/TopicContent";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <SidebarLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chapter/:chapterId" element={<ChapterOverview />} />
              <Route path="/chapter/:chapterId/:topicId" element={<TopicContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarLayout>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
