import Layout from '../components/Layout/Layout'
import { Users, Shield, Zap, ShoppingCart, CreditCard, BarChart, Package, Settings } from 'lucide-react';
import { useLanguage } from '../components/languages/LanguageContext';

function WelcomPage() {

    const { t } = useLanguage();

    return (
        <div>
            <Layout>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                    <div className="container-custom py-20 lg:py-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans leading-tight mb-6">
                                    <p className='font-family-sans'>RetailPro POS</p>
                                    <span className="text-gradient bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                        Smart Business Solution
                                    </span>
                                </h1>
                                <p className="text-lg sm:text-xl text-blue-100 mb-8">
                                    Streamline your sales, manage inventory, and grow your business with our powerful point-of-sale system.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                                        {t("login")}
                                    </button>
                                    <button className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                                        {t("register")}
                                    </button>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-50"></div>
                                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/20 rounded-lg p-4 text-center">
                                                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <ShoppingCart />
                                                </div>
                                                <p className="text-sm">Quick Checkout</p>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-4 text-center">
                                                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <CreditCard />
                                                </div>
                                                <p className="text-sm">Multiple Payments</p>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-4 text-center">
                                                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <BarChart />
                                                </div>
                                                <p className="text-sm">Sales Analytics</p>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-4 text-center">
                                                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Package />
                                                </div>
                                                <p className="text-sm">Inventory Control</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Why RetailPro POS?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Designed to help retailers manage sales, inventory and customers efficiently.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <Zap className="w-8 h-8 text-blue-600" />,
                                    title: "Lightning Fast Sales",
                                    description: "Process transactions in seconds with our optimized checkout flow."
                                },
                                {
                                    icon: <Shield className="w-8 h-8 text-green-600" />,
                                    title: "Secure & Reliable",
                                    description: "Bank-grade security for all transactions and customer data."
                                },
                                {
                                    icon: <Users className="w-8 h-8 text-purple-600" />,
                                    title: "Customer Management",
                                    description: "Track purchase history and build customer loyalty programs."
                                },
                                {
                                    icon: <Settings className="w-8 h-8 text-yellow-600" />,
                                    title: "Easy Integration",
                                    description: "Works with your existing hardware and accounting software."
                                }
                            ].map((feature, index) => (
                                <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                                    <div className="flex justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gray-900 text-white py-20">
                    <div className="container-custom text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of retailers using RetailPro to increase sales and simplify operations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                                Get Started Today
                            </button>
                            <button className="btn border-2 border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900 px-8 py-3 text-lg">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </section>
            </Layout>
        </div>
    )
}

export default WelcomPage