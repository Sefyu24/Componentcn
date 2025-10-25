"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  joinedYear: string;
  initials: string;
};

type TeamGroup = {
  id: string;
  title: string;
  members: TeamMember[];
  defaultOpen?: boolean;
};

type TeamMembersProps = {
  teams: TeamGroup[];
  className?: string;
};

export function TeamMembers({ teams, className }: TeamMembersProps) {
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(
    new Set(teams.filter((team) => team.defaultOpen).map((team) => team.id))
  );

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {teams.map((team) => (
        <TeamGroupCard
          key={team.id}
          team={team}
          isOpen={openGroups.has(team.id)}
          onToggle={() => toggleGroup(team.id)}
        />
      ))}
    </div>
  );
}

type TeamGroupCardProps = {
  team: TeamGroup;
  isOpen: boolean;
  onToggle: () => void;
};

function TeamGroupCard({ team, isOpen, onToggle }: TeamGroupCardProps) {
  const visibleAvatars = team.members.slice(0, 4);
  const remainingCount = Math.max(0, team.members.length - 4);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <motion.div
        layout
        className="rounded-xl border border-border/60 bg-card/80 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-auto w-full items-center justify-between p-4 text-left hover:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                {team.title}
              </h3>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </motion.span>
            </div>

            <AvatarStack
              members={visibleAvatars}
              remainingCount={remainingCount}
              isCollapsed={!isOpen}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <motion.div layout className="border-t border-border/40 p-4 pt-3">
            <motion.div layout className="space-y-3">
              {team.members.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </motion.div>
          </motion.div>
        </CollapsibleContent>
      </motion.div>
    </Collapsible>
  );
}

type AvatarStackProps = {
  members: TeamMember[];
  remainingCount: number;
  isCollapsed: boolean;
};

function AvatarStack({
  members,
  remainingCount,
  isCollapsed,
}: AvatarStackProps) {
  return (
    <div className="flex items-center">
      <motion.div
        layout
        initial={false}
        className="relative flex h-8"
        style={{ gap: isCollapsed ? 0 : 8 }}
      >
        <AnimatePresence>
          {members.map((member, index) => {
            const layoutId = `member-${member.id}`;
            return (
              <motion.div
                key={member.id}
                layoutId={layoutId}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                style={{
                  zIndex: members.length - index,
                  marginLeft: isCollapsed ? (index === 0 ? 0 : -12) : 0,
                }}
              >
                <motion.div
                  layout
                  className="inline-flex"
                  animate={{
                    x: isCollapsed ? 0 : index * 44,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: isCollapsed ? index * 0.04 : index * 0.02,
                  }}
                >
                  <Avatar className="size-8 border-2 border-background shadow-sm">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs font-medium">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {remainingCount > 0 && (
            <motion.div
              key="remaining"
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, delay: members.length * 0.05 }}
              style={{
                zIndex: 1,
                marginLeft: isCollapsed ? -12 : members.length ? 8 : 0,
              }}
            >
              <motion.div
                layout
                animate={{ x: isCollapsed ? 0 : members.length * 44 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <Avatar className="size-8 border-2 border-background bg-muted shadow-sm">
                  <AvatarFallback className="text-xs font-medium text-muted-foreground">
                    {remainingCount}+
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

type MemberRowProps = {
  member: TeamMember;
};

function MemberRow({ member }: MemberRowProps) {
  return (
    <motion.div
      layout
      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-3">
        <motion.div layoutId={`member-${member.id}`} className="inline-flex">
          <Avatar className="size-10">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-sm font-medium">
              {member.initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div>
          <p className="font-medium text-foreground">{member.name}</p>
          <p className="text-sm text-muted-foreground">
            Joined &apos {member.joinedYear}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="size-8">
        <MoreHorizontalIcon className="size-4" />
        <span className="sr-only">More options for {member.name}</span>
      </Button>
    </motion.div>
  );
}

// Sample data to match your image
export const sampleTeamData: TeamGroup[] = [
  {
    id: "design-engineer",
    title: "Design Engineer",
    defaultOpen: true,
    members: [
      {
        id: "damian",
        name: "Damian Edward",
        avatar: "/avatars/damian.jpg",
        joinedYear: "23",
        initials: "DE",
      },
      {
        id: "clara",
        name: "Clara Benton",
        avatar: "/avatars/clara.jpg",
        joinedYear: "23",
        initials: "CB",
      },
      {
        id: "ethan",
        name: "Ethan Miles",
        avatar: "/avatars/ethan.jpg",
        joinedYear: "24",
        initials: "EM",
      },
      {
        id: "edward",
        name: "Edward Freece",
        avatar: "/avatars/edward.jpg",
        joinedYear: "24",
        initials: "EF",
      },
      {
        id: "susy",
        name: "Susy Xerxes",
        avatar: "/avatars/susy.jpg",
        joinedYear: "25",
        initials: "SX",
      },
    ],
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    members: [
      {
        id: "alex",
        name: "Alex Johnson",
        avatar: "/avatars/alex.jpg",
        joinedYear: "22",
        initials: "AJ",
      },
      {
        id: "maria",
        name: "Maria Garcia",
        avatar: "/avatars/maria.jpg",
        joinedYear: "23",
        initials: "MG",
      },
      {
        id: "david",
        name: "David Chen",
        avatar: "/avatars/david.jpg",
        joinedYear: "24",
        initials: "DC",
      },
    ],
  },
  {
    id: "product-owner",
    title: "Product Owner",
    members: [
      {
        id: "sarah",
        name: "Sarah Wilson",
        avatar: "/avatars/sarah.jpg",
        joinedYear: "21",
        initials: "SW",
      },
      {
        id: "mike",
        name: "Mike Thompson",
        avatar: "/avatars/mike.jpg",
        joinedYear: "22",
        initials: "MT",
      },
    ],
  },
];
