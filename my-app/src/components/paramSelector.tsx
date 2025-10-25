import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

//We need to pass: Title, value, function on value change SelectValue PlaceHolder, array to map over

interface ParamSelectorType<T extends string> {
  title: string;
  classname?: string;
  onValueChange: (value: T) => void;
  placeHolderValue: string;
  value: T;
  contentOptions: Array<{ value: T; label: string }> | T[];
}

export default function ParamSelector<T extends string>({
  title,
  value,
  onValueChange,
  placeHolderValue,
  contentOptions,
  classname = "border-4 border-amber-300 p-4 flex flex-col gap-2 mb-4",
}: ParamSelectorType<T>) {
  const isObjectArray =
    contentOptions.length > 0 && typeof contentOptions[0] === "object";
  return (
    <div className={classname}>
      <Label>{title}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeHolderValue} />
        </SelectTrigger>
        <SelectContent>
          {isObjectArray
            ? (contentOptions as Array<{ value: T; label: string }>).map(
                ({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )
            : (contentOptions as T[]).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div>
  );
}
