"use client";
import { format } from "date-fns";
import {
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

type ChatImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
  images?: Array<{ id: string; previewUrl: string }>;
};

type PendingImage = ChatImage & { uploading?: boolean };

type AiChatProps = {
  className?: string;
};

export function AiChat({ className }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const autoScrollToLatest = useCallback(() => {
    const viewport = scrollContainerRef.current?.querySelector<HTMLElement>(
      "[data-slot=scroll-area-viewport]"
    );
    if (!viewport) return;
    requestAnimationFrame(() => {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    autoScrollToLatest();
  }, [messages, autoScrollToLatest]);

  useEffect(() => {
    return () => {
      pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [pendingImages]);

  const handleAddImages = useCallback((files: FileList | File[]) => {
    const images: PendingImage[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      images.push({ id, file, previewUrl });
    });
    if (!images.length) return;
    setPendingImages((prev) => [...prev, ...images]);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const { files } = event.dataTransfer;
      handleAddImages(files);
      setIsDragOver(false);
    },
    [handleAddImages]
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      Array.from(items).forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      });
      if (files.length) handleAddImages(files);
    },
    [handleAddImages]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!isDragOver) setIsDragOver(true);
    },
    [isDragOver]
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const clearPendingImage = useCallback((imageId: string) => {
    setPendingImages((prev) => prev.filter((image) => image.id !== imageId));
  }, []);

  const resetComposer = useCallback(() => {
    setInputValue("");
    setPendingImages((images) => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed && pendingImages.length === 0) return;

    setIsSubmitting(true);

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
      images: pendingImages.map(({ id, previewUrl }) => ({ id, previewUrl })),
    };

    setMessages((prev) => [...prev, newMessage]);
    resetComposer();

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          trimmed.length > 0
            ? `I received your message: "${trimmed}" and will update the requested Shadcn component.`
            : "I received your images. Let me know which component we should adjust.",
        createdAt: new Date(),
      },
    ]);

    setIsSubmitting(false);
  }, [inputValue, pendingImages, resetComposer]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit]
  );

  const renderedMessages = useMemo(() => {
    return messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ));
  }, [messages]);

  return (
    <Card
      className={cn(
        "relative flex h-full min-h-[480px] w-full flex-col flex-shrink-0",
        className
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Component Chat</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{messages.length} messages</span>
            <span aria-hidden>•</span>
            <span>Drag & drop or paste images</span>
          </div>
        </div>
        <CardDescription>
          Collaborate with the AI to modify Shadcn components. Provide text or
          imagery for clarity.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-0 pb-0">
        <div className="flex h-full flex-col">
          <div className="flex-1 px-6">
            <MessageTimeline
              messages={renderedMessages}
              scrollContainerRef={scrollContainerRef}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-muted/40">
        <Composer
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          isDragOver={isDragOver}
          isSubmitting={isSubmitting}
          pendingImages={pendingImages}
          onRemovePendingImage={clearPendingImage}
          onFileInputChange={handleAddImages}
          fileInputRef={fileInputRef}
          onReset={resetComposer}
        />
      </CardFooter>
    </Card>
  );
}

type MessageBubbleProps = {
  message: ChatMessage;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const formattedTime = format(message.createdAt, "p");

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-full flex-col gap-2 rounded-2xl border px-4 py-3 shadow-sm",
          isUser
            ? "border-primary/20 bg-primary text-primary-foreground"
            : "border-border/80 bg-card/80 text-foreground"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content || <span className="opacity-70">(no text)</span>}
        </div>
        {message.images?.length ? (
          <div className="flex flex-wrap gap-2">
            {message.images.map((image) => (
              <div
                key={image.id}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/30"
              >
                <img
                  src={image.previewUrl}
                  alt="Uploaded"
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <span className="text-xs text-muted-foreground">{formattedTime}</span>
    </div>
  );
}

type MessageTimelineProps = {
  messages: ReactNode[];
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
};

function MessageTimeline({
  messages,
  scrollContainerRef,
}: MessageTimelineProps) {
  return (
    <ScrollArea className="h-full w-full" ref={scrollContainerRef}>
      <div className="flex h-full w-full flex-col gap-4 py-4">
        {messages.length ? (
          messages
        ) : (
          <div className="text-center text-sm text-muted-foreground/80">
            Start the conversation by describing the Shadcn component update you
            need.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

type ComposerProps = {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  isDragOver: boolean;
  isSubmitting: boolean;
  pendingImages: PendingImage[];
  onRemovePendingImage: (imageId: string) => void;
  onFileInputChange: (files: FileList | File[]) => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onReset: () => void;
};

function Composer({
  inputValue,
  onInputChange,
  onSubmit,
  onKeyDown,
  onPaste,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
  isSubmitting,
  pendingImages,
  onRemovePendingImage,
  onFileInputChange,
  fileInputRef,
  onReset,
}: ComposerProps) {
  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      onFileInputChange(files);
      event.target.value = "";
    },
    [onFileInputChange]
  );

  const dragClasses = cn(
    "transition-colors",
    isDragOver ? "border-primary bg-primary/10" : "border-border/80 bg-card/80"
  );

  return (
    <div className="flex w-full flex-col gap-3">
      {pendingImages.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pendingImages.map((image) => (
            <div
              key={image.id}
              className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border/70"
            >
              <img
                src={image.previewUrl}
                alt="Preview"
                className="size-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-1 top-1 size-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onRemovePendingImage(image.id)}
              >
                <span className="sr-only">Remove image</span>
                <span aria-hidden>X</span>
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={cn("flex flex-col gap-2 rounded-xl border p-3", dragClasses)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <Textarea
          placeholder="Describe the Shadcn component change you need..."
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          className="min-h-[90px] resize-none border-none bg-transparent px-0 text-sm focus-visible:ring-0"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Attach images
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-sm"
              onClick={onReset}
              disabled={!inputValue && pendingImages.length === 0}
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="text-sm"
              onClick={onReset}
              disabled={
                isSubmitting && !inputValue && pendingImages.length === 0
              }
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={() => void onSubmit()}
              disabled={
                isSubmitting ||
                (!inputValue.trim() && pendingImages.length === 0)
              }
            >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
