"use client";

import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const livreFieldClassName = cn(
  "h-12 rounded-lv-sm border-livre-petrol-500 bg-livre-bg-surface text-base text-livre-text",
  "placeholder:text-white/40",
  "focus-visible:border-livre-primary focus-visible:ring-2 focus-visible:ring-livre-primary/30 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

const LivreForm = Form;

const LivreFormField = FormField;

const LivreFormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <FormItem ref={ref} className={cn("space-y-2", className)} {...props} />
));
LivreFormItem.displayName = "LivreFormItem";

const LivreFormLabel = React.forwardRef<
  React.ElementRef<typeof FormLabel>,
  React.ComponentPropsWithoutRef<typeof FormLabel>
>(({ className, ...props }, ref) => (
  <FormLabel
    ref={ref}
    className={cn("text-sm font-medium text-livre-text/80", className)}
    {...props}
  />
));
LivreFormLabel.displayName = "LivreFormLabel";

const LivreFormControl = FormControl;

const LivreFormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <FormDescription
    ref={ref}
    className={cn("text-xs text-livre-muted", className)}
    {...props}
  />
));
LivreFormDescription.displayName = "LivreFormDescription";

const LivreFormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <FormMessage
    ref={ref}
    className={cn("text-xs font-medium text-livre-error", className)}
    {...props}
  />
));
LivreFormMessage.displayName = "LivreFormMessage";

const LivreInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <Input ref={ref} className={cn(livreFieldClassName, className)} {...props} />
));
LivreInput.displayName = "LivreInput";

const LivreTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    className={cn(
      livreFieldClassName,
      "min-h-[120px] resize-none py-3",
      className
    )}
    {...props}
  />
));
LivreTextarea.displayName = "LivreTextarea";

type LivreSelectProps = React.ComponentProps<typeof Select>;

function LivreSelect({ ...props }: LivreSelectProps) {
  return <Select {...props} />;
}

const LivreSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, children, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    className={cn(livreFieldClassName, "data-[placeholder]:text-white/40", className)}
    {...props}
  >
    {children}
  </SelectTrigger>
));
LivreSelectTrigger.displayName = "LivreSelectTrigger";

const LivreSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => (
  <SelectContent
    ref={ref}
    className={cn(
      "border-livre-petrol-500 bg-livre-bg-elevated text-livre-text",
      className
    )}
    {...props}
  />
));
LivreSelectContent.displayName = "LivreSelectContent";

const LivreSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn("focus:bg-livre-primary/10 focus:text-livre-text", className)}
    {...props}
  />
));
LivreSelectItem.displayName = "LivreSelectItem";

const LivreSelectValue = SelectValue;

export {
  LivreForm,
  LivreFormField,
  LivreFormItem,
  LivreFormLabel,
  LivreFormControl,
  LivreFormDescription,
  LivreFormMessage,
  LivreInput,
  LivreTextarea,
  LivreSelect,
  LivreSelectTrigger,
  LivreSelectContent,
  LivreSelectItem,
  LivreSelectValue,
  useFormField,
};
