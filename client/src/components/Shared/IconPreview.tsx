// client/src/components/Shared/IconPreview.tsx
import React from "react";
import type { IconBaseProps } from "react-icons";
import * as Ai from "react-icons/ai";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";
import * as Tb from "react-icons/tb"; // tabler (exemplo)
import * as Gi from "react-icons/gi"; // game icons (exemplo)

type Props = {
  library?: string | null;
  name?: string | null;
  props?: Record<string, any> | null;
  size?: number;
  className?: string;
};

const libs: Record<string, Record<string, React.ComponentType<IconBaseProps>>> = {
  ai: Ai,
  fa: Fa,
  md: Md,
  tb: Tb,
  gi: Gi,
  // adicione outros pacotes caso use (bs, ri, si, etc.)
};

const DefaultIcon = Ai.AiOutlineQuestion;

export default function IconPreview({ library, name, props, size = 18, className }: Props) {
  if (!library || !name) return <DefaultIcon size={size} className={className} />;

  const lib = libs[library.toLowerCase()];
  const Component = lib ? (lib as any)[name] : undefined;

  if (!Component) return <DefaultIcon size={size} className={className} />;

  const safeProps = {
    size: props?.size ?? size,
    title: props?.title,
    className,
    ...props,
  };

  return <Component {...(safeProps as IconBaseProps)} />;
}
