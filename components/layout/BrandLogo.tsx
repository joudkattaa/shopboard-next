import { HomeLink } from "@/features/catalog/ShopLink";
import BrandIcon from "@/components/layout/BrandIcon";

export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <HomeLink aria-label="Roseveil Cosmetics home" className={"flex w-max shrink-0 flex-col items-center dark:text-primary " + (footer ? "mb-3 text-[var(--rose-dark)]" : "text-mulberry-wine")}>
      <BrandIcon name="flower" className={"mb-1 size-6 stroke-[1.2] min-[1000px]:size-[25px] " + (footer ? "text-[var(--rose-dark)] dark:text-primary" : "text-primary")} />
      <span className={"font-heading font-semibold leading-none " + (footer ? "text-2xl tracking-[3px]" : "text-[25px] tracking-[2.6px]")}>ROSEVEIL<small className="mt-1.5 block text-center font-sans text-[7px] font-medium leading-none tracking-[3.2px]">COSMETICS</small></span>
    </HomeLink>
  );
}
