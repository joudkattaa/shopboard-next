import type { Metadata } from "next";
import AboutSection from "@/components/editorial/AboutSection";
import BeautyPromise from "@/components/editorial/BeautyPromise";
export const metadata:Metadata={title:"About ROSEVEIL"};
export default function AboutPage(){return <div data-about-page className="pb-12 pt-8"><h1 className="mx-auto mb-6 w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px] text-[clamp(32px,4vw,46px)] font-medium leading-[1.2]">About ROSEVEIL</h1><AboutSection/><BeautyPromise/></div>}
