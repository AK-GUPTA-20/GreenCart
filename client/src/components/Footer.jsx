import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="bg-green-50 text-gray-700 px-6 md:px-16 lg:px-24 xl:px-32 mt-24">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-300">
                {/* Brand + About */}
                <div>
                    <img className="w-36 md:w-40 rounded-md" src={assets.logo} alt="GreenCart Logo" />
                    <p className="max-w-md mt-4 text-sm leading-relaxed text-gray-600">
                        We deliver fresh groceries and snacks straight to your door. Trusted by thousands,
                        we aim to make your shopping experience simple and affordable.
                        Enjoy a wide range of products at unbeatable prices.
                    </p>
                </div>

                {/* Link Sections */}
                <div className="flex flex-wrap justify-between w-full md:w-[60%] gap-8">
                    {footerLinks.map((section, index) => (
                        <div key={index} className="min-w-[140px]">
                            <h3 className="font-semibold text-green-700 text-base mb-3">{section.title}</h3>
                            <ul className="text-sm space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.url}
                                            className="hover:text-green-600 transition-colors duration-200"
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright + Signature */}
            <div className="flex flex-col md:flex-row items-center justify-between py-4 text-sm text-center md:text-left gap-2">
                <p>
                    Copyright © {new Date().getFullYear()}
                    <span className="text-green-700 font-semibold"> GreenCart</span>. All Rights Reserved.
                </p>
                <p className="text-xs text-gray-500 md:ml-auto md:text-right">
                    Made ❤️ by <span className="font-medium text-green-700">Akshat Gupta</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
