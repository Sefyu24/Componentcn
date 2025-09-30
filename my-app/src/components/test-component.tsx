import { Button } from "./ui/button";

export type variant =
  | "default"
  | "link"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";

export default function TestComponent({ variant }: { variant: variant }) {
  return <Button variant={variant}> Hello</Button>;
}
