import FooterColumn from "./footer/FooterColumn";
import SocialLinks from "./footer/SocialLinks";
import Copyright from "./footer/Copyright";

const repairLinks = [
    { href: "/repair/apple", text: "APPLE" },
    { href: "/repair/samsung", text: "SAMSUNG" },
    { href: "/repair/xiaomi", text: "XIAOMI" },
    { href: "/repair/huawei", text: "HUAWEI" },
];

const servicesLinks = [
    { href: "/accessories", text: "Accessories" },
    { href: "/phones", text: "Smartphones" },
];

const storesLinks = [
    { href: "/contact", text: "Store" },
];

const usefulLinks = [
    { href: "/terms-and-conditions", text: "Terms and Conditions" },
    { href: "/privacy-policy", text: "Privacy Policy" },
    { href: "/refund-return-policy", text: "Refund / Return Policy" },
    { href: "/api-terms-of-use", text: "API Terms of Use" },
    { href: "/contact", text: "Contact Us" },
];

export default function Footer() {
    return (
        <footer className="bg-primary text-secondary py-10 px-6 md:px-20 relative overflow-hidden">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <FooterColumn title="Repair" links={repairLinks} />
                <FooterColumn title="Services" links={servicesLinks} />
                <FooterColumn title="Our Stores" links={storesLinks} />
                <FooterColumn title="Useful Links" links={usefulLinks} />
            </div>
            <SocialLinks />
            <Copyright />
        </footer>
    );
}
