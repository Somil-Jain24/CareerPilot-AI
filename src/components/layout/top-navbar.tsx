import { useState } from "react";
import { Menu, Search, Bell, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const notifications = [
  { title: "Resume re-analyzed", desc: "Your ATS score improved by 6 points.", time: "2m" },
  { title: "Interview session ready", desc: "3 new technical questions added.", time: "1h" },
  { title: "Roadmap milestone", desc: "Week 1: Cloud Foundations complete.", time: "5h" },
];

export function TopNavbar({ onMenu }: { onMenu: () => void }) {
  const { themeMode, setTheme } = useTheme();
  const [unread] = useState(notifications.length);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search analyses, skills, resources…"
          className="glass h-10 w-full rounded-xl pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Select theme"
            >
              {themeMode === "light" && <Sun className="h-5 w-5 text-warning" />}
              {themeMode === "dark" && <Moon className="h-5 w-5 text-primary" />}
              {themeMode === "system" && <Monitor className="h-5 w-5 text-slate-400" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 glass-strong">
            <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-warning" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-slate-400" /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-secondary" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass-strong">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2.5">
                <div className="flex w-full justify-between">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.desc}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">Jordan Dev</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 glass-strong">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
