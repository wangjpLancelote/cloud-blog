import * as React from "react";
import { cn } from "@/lib/utils";

// 自定义 Card 基础样式
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-white text-card-foreground shadow-sm",
      // 可以添加自定义样式
      // "shadow-md hover:shadow-lg transition-shadow", // 示例：增强阴影效果
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// 自定义 CardHeader 样式
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      // 可以添加自定义样式
      // "border-b", // 示例：添加底部边框
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// 自定义 CardTitle 样式
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      // 可以添加自定义样式
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// 自定义 CardDescription 样式
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      // 可以添加自定义样式
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// 自定义 CardContent 样式
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-0",
      // 可以添加自定义样式
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// 自定义 CardFooter 样式
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      // 可以添加自定义样式
      // "border-t", // 示例：添加顶部边框
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
