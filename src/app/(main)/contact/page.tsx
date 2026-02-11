import ContactPageContent from "@/components/contacts/contactpage";
import ContactFooter from "@/components/layouts/footer/contact-footer";
import Header from "@/components/layouts/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

const ContactPage = () => {
  return (
    <div>
      <Header />
      <ContactPageContent />
      <ContactFooter />
    </div>
  );
};

export default ContactPage;


