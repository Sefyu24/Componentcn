"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
  type CaptionProps,
  useDayPicker,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

const defaultTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
];

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  timeSlots = defaultTimeSlots,
  selectedTimeSlot,
  initialTimeSlot,
  onTimeSlotSelect,
  timeSlotHeading = "Available Times",
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  timeSlots?: string[];
  selectedTimeSlot?: string;
  initialTimeSlot?: string;
  onTimeSlotSelect?: (slot: string) => void;
  timeSlotHeading?: string;
}) {
  const defaultClassNames = getDefaultClassNames();
  const isControlled = selectedTimeSlot !== undefined;
  const [internalSelectedSlot, setInternalSelectedSlot] = React.useState<
    string | null
  >(() => {
    if (isControlled) return selectedTimeSlot ?? null;
    if (initialTimeSlot) return initialTimeSlot;
    return timeSlots.length > 0 ? timeSlots[0] ?? null : null;
  });

  React.useEffect(() => {
    if (isControlled) {
      setInternalSelectedSlot(selectedTimeSlot ?? null);
    }
  }, [isControlled, selectedTimeSlot]);

  React.useEffect(() => {
    if (!isControlled) {
      if (timeSlots.length === 0) {
        setInternalSelectedSlot(null);
        return;
      }
      setInternalSelectedSlot((prev) => {
        if (prev && timeSlots.includes(prev)) return prev;
        if (initialTimeSlot && timeSlots.includes(initialTimeSlot)) {
          return initialTimeSlot;
        }
        return timeSlots[0] ?? null;
      });
    }
  }, [isControlled, timeSlots, initialTimeSlot]);

  const handleTimeSlotSelect = (slot: string) => {
    if (!isControlled) {
      setInternalSelectedSlot(slot);
    }
    onTimeSlotSelect?.(slot);
  };

  const currentSelectedSlot = isControlled
    ? selectedTimeSlot ?? null
    : internalSelectedSlot;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disableNavigation={false}
      className={cn(
        "group/calendar [--cell-size:--spacing(12)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("flex-1 w-full", defaultClassNames.months),
        month: cn("flex flex-col gap-6", defaultClassNames.month),
        nav: cn(
          "flex items-center justify-between w-full mb-4",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-10 w-10 rounded-xl border border-border/60 bg-card/80 text-foreground hover:bg-accent/20 aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-10 w-10 rounded-xl border border-border/60 bg-card/80 text-foreground hover:bg-accent/20 aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-base font-medium justify-center h-(--cell-size) gap-2",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-semibold text-xl",
          captionLayout === "label"
            ? "text-lg"
            : "rounded-md pl-2 pr-1 flex items-center gap-2 text-lg h-10 [&>svg]:text-muted-foreground [&>svg]:size-4",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-medium text-sm select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-3", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, children, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(
                "rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm",
                className
              )}
              {...props}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex-1">{children}</div>
                {timeSlots.length > 0 ? (
                  <aside className="w-full border-t border-border/60 pt-6 lg:w-72 lg:border-l lg:border-t-0 lg:pl-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight">
                          {timeSlotHeading}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a time for the selected day.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {timeSlots.map((slot) => {
                          const isSelected = currentSelectedSlot === slot;
                          return (
                            <Button
                              key={slot}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className={cn(
                                "w-full justify-between",
                                !isSelected && "text-foreground"
                              )}
                              onClick={() => handleTimeSlotSelect(slot)}
                            >
                              <span>{slot}</span>
                              {isSelected ? (
                                <span className="text-xs font-medium uppercase">
                                  Selected
                                </span>
                              ) : null}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>
                ) : null}
              </div>
            </div>
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

type CalendarCaptionProps = CaptionProps & {
  buttonVariant: React.ComponentProps<typeof Button>["variant"];
  captionLayout: React.ComponentProps<typeof DayPicker>["captionLayout"];
};

function CalendarCaption({
  calendarMonth,
  className,
  buttonVariant,
  captionLayout,
  ...props
}: CalendarCaptionProps) {
  const { goToMonth, previousMonth, nextMonth } = useDayPicker();

  const monthLabel = calendarMonth.date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handlePreviousClick = () => {
    if (previousMonth) {
      goToMonth(previousMonth);
    }
  };

  const handleNextClick = () => {
    if (nextMonth) {
      goToMonth(nextMonth);
    }
  };

  return (
    <div
      className={cn("flex items-center justify-between gap-4 mb-4", className)}
      {...props}
    >
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          captionLayout === "dropdown"
            ? "flex-1 text-center"
            : "flex-1 text-left"
        )}
      >
        {monthLabel}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={buttonVariant}
          size="icon"
          className="size-10"
          onClick={handlePreviousClick}
          disabled={!previousMonth}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={buttonVariant}
          size="icon"
          className="size-10"
          onClick={handleNextClick}
          disabled={!nextMonth}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
