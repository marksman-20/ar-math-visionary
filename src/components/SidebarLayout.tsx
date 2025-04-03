
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader, 
  SidebarTrigger,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Book, BookOpen, Grid3X3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const navItems = [
    {
      title: "Home",
      url: "/",
      icon: Grid3X3
    },
    {
      title: "Coordinate Geometry",
      url: "/chapter/coordinate-geometry",
      icon: BookOpen,
      subitems: [
        {
          title: "Introduction",
          url: "/chapter/coordinate-geometry/introduction"
        },
        {
          title: "Distance Formula",
          url: "/chapter/coordinate-geometry/distance-formula"
        },
        {
          title: "Conic Sections",
          url: "/chapter/coordinate-geometry/conic-sections"
        },
        {
          title: "Circles",
          url: "/chapter/coordinate-geometry/circles"
        },
        {
          title: "Ellipses",
          url: "/chapter/coordinate-geometry/ellipses"
        }, 
        {
          title: "Parabolas",
          url: "/chapter/coordinate-geometry/parabolas"
        },
        {
          title: "Hyperbolas",
          url: "/chapter/coordinate-geometry/hyperbolas"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <Sidebar className="border-r border-border">
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-ar-blue p-1">
                <Grid3X3 className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-lg">AugumentED</div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Learning Path</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="py-0.5">
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={cn(
                          "px-3 py-2 w-full",
                          location.pathname === item.url && "bg-muted"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      
                      {item.subitems && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.subitems.map((subitem) => (
                            <Button 
                              key={subitem.title}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-8 px-2 py-1 text-sm",
                                location.pathname === subitem.url && "bg-muted"
                              )}
                              onClick={() => navigate(subitem.url)}
                            >
                              <ChevronRight className="mr-1 h-3 w-3" />
                              <span>{subitem.title}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="px-4 py-2">
            <SidebarTrigger />
          </div>
          <main className="p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
