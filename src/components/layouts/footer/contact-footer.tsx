import type { ComponentType } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactChannel = {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
};

type SocialLink = {
  name: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
};

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "อีเมล",
    value: "contact-doagthai@doag-thai.com",
    icon: Mail,
    href: "mailto:contact-doagthai@doag-thai.com",
  },
  {
    label: "Facebook",
    value: "DOAG THAI",
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61579149763038",
  },

  {
    label: "ที่ตั้ง",
    value: "กรุงเทพมหานคร",
    icon: MapPin,
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61579149763038",
  },
  {
    name: "LINE",
    icon: MessageCircle,
    href: "https://line.me/ti/p/yourlineid",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/yourusername",
  },
];

const contactCardBaseClass =
  "flex w-full items-start gap-3 rounded-lg border border-border/70 bg-background/80 p-4 transition-colors transition-transform hover:-translate-y-0.5 hover:border-primary/40";

const baseSocialButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:-translate-y-0.5";

function getSocialButtonColor(name: string) {
  switch (name.toLowerCase()) {
    case "facebook":
      return "bg-blue-600 hover:bg-blue-700";
    case "line":
      return "bg-green-500 hover:bg-green-600";
    case "instagram":
      return "bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

function isExternal(url: string) {
  return url.startsWith("http");
}

function ContactChannelCard({
  label,
  value,
  icon: Icon,
  href,
}: ContactChannel) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 space-y-1 text-xs md:text-sm">
        <p className="font-medium text-muted-foreground">{label}</p>
        <p className="break-all font-semibold text-foreground group-hover:text-primary">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return <div className={cn("group", contactCardBaseClass)}>{content}</div>;
  }

  return (
    <a
      href={href}
      target={isExternal(href) ? "_blank" : undefined}
      rel={isExternal(href) ? "noopener noreferrer" : undefined}
      className={cn("group", contactCardBaseClass, "hover:bg-primary/5")}
    >
      {content}
    </a>
  );
}

function SocialLinkButton({ name, icon: Icon, href }: SocialLink) {
  const buttonClass = `${baseSocialButtonClass} ${getSocialButtonColor(name)}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`เปิด ${name}`}
      className={buttonClass}
    >
      <Icon className="h-5 w-5 text-white" />
    </Link>
  );
}

export default function ContactFooter() {
  return (
    // <section className="border-t border-border bg-muted/30 py-12">
    <section className="border-t border-border bg-background py-5">
      <div className="container mx-auto px-4">
        <div className="grid w-full gap-12 md:grid-cols-[1.1fr_minmax(0,1fr)] md:items-start">
          {/* ฝั่งข้อมูลและข้อความ */}
          <div className="flex flex-col gap-8 border-b border-border/60 pb-10 md:border-b-0 md:border-r md:pb-0 md:pr-12">
            <div className="max-w-lg space-y-4">
              <h2 className="text-2xl font-semibold text-primary md:text-3xl">
                พร้อมช่วยเหลือคุณทุกขั้นตอน
              </h2>
              <p className="text-base text-muted-foreground">
                ทีมงาน DOAG THAI ให้คำแนะนำเรื่องสินค้า โปรโมชั่น
                และการจัดส่งทุกวัน เวลา 10:00 - 22:00 น.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                เลือกช่องทางที่สะดวก หรือทักหาเราผ่าน LINE
                เพื่อเริ่มแชทกับแอดมินทันที
              </p>
              <Button asChild size="lg" className="w-fit gap-2">
                <Link
                  href="https://www.facebook.com/profile.php?id=61579149763038"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  คุยกับแอดมินตอนนี้
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-background/70 px-5 py-4 text-sm shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">บริการลูกค้า</p>
                <p className="text-muted-foreground">
                  ตอบกลับภายใน 15 นาทีในเวลาทำการ
                </p>
              </div>
            </div>
          </div>

          {/* ฝั่งช่องทางการติดต่อและโซเชียล */}
          <div className="flex flex-col gap-8 md:pl-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {CONTACT_CHANNELS.map((channel) => (
                <ContactChannelCard key={channel.label} {...channel} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <SocialLinkButton key={link.name} {...link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
