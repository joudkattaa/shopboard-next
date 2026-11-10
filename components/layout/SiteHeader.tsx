import AnnouncementBar from "@/components/layout/AnnouncementBar";
import BrandIcon from "@/components/layout/BrandIcon";
import BrandLogo from "@/components/layout/BrandLogo";
import HeaderNavigation from "@/components/layout/HeaderNavigation";

export default function SiteHeader() {
  return <>
    <AnnouncementBar />
    <header className="border-b border-border bg-background dark:bg-card">
      <HeaderNavigation logo={<BrandLogo />} actions={
        <div className="order-2 col-span-full flex w-full justify-between gap-3 min-[480px]:w-auto min-[480px]:gap-1 min-[1200px]:shrink-0">
          {([['moon', 'Dark mode unavailable', true], ['search', 'Search products unavailable', false], ['user', 'Demo account unavailable', false], ['bag', 'Shopping bag unavailable', false]] as const).map(([name, label, bordered]) =>
            <button key={name} type="button" disabled aria-label={label} aria-describedby="header-unavailable" title={label} className={"relative grid size-11 shrink-0 cursor-not-allowed disabled:opacity-50 place-items-center rounded-full p-2.5 " + (bordered ? "border border-border" : "")}>
              <BrandIcon name={name} className={name === 'moon' ? 'dark:hidden' : ''} />
              {name === 'moon' && <BrandIcon name="sun" className="hidden dark:block" />}
              {name === 'bag' && <span aria-hidden="true" className="absolute right-0 top-0 h-[15px] min-w-[15px] rounded-full bg-primary px-[3px] text-[8px] text-primary-foreground">0</span>}
            </button>)}
        </div>
      } />
      <p id="header-unavailable" className="sr-only">Category navigation, About Us, Blog, Contact, theme switching, search, account and shopping bag are unavailable during this migration stage.</p>
    </header>
  </>;
}
