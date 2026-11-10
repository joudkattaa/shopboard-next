import { DiscoveryNavigation } from "@/features/catalog/DiscoveryProvider";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import HeaderActions from "@/components/layout/HeaderActions";
import HeaderSearchPanel from "@/components/layout/HeaderSearchPanel";
import BrandLogo from "@/components/layout/BrandLogo";
import HeaderNavigation from "@/components/layout/HeaderNavigation";

export default function SiteHeader() {
  return <>
    <AnnouncementBar />
    <header className="border-b border-border bg-background dark:bg-card">
      <DiscoveryNavigation><HeaderNavigation logo={<BrandLogo />} actions={<HeaderActions />} />
      <HeaderSearchPanel /></DiscoveryNavigation>
      <p id="header-unavailable" className="sr-only">Blog, Contact and account are unavailable during this migration stage.</p>
    </header>
  </>;
}
