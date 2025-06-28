"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { creditBenefits, features, testimonials } from "@/lib/data";
import Pricing from "@/components/pricing";





export default function Home() {

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* hero section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-600/10"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-8">
              ✨ Next-Generation Healthcare Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent mb-6">
              Healthcare Made
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Simple & Accessible
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect with qualified healthcare professionals, book appointments instantly,
              and manage your health journey with our cutting-edge platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 px-8 py-6 text-lg font-semibold shadow-2xl shadow-amber-500/25">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 px-8 py-6 text-lg font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* feature section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
                🚀 Simple Process
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
                How It Works
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                Our platform makes healthcare accessible with just a few clicks.
                Experience the future of medical care today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border-0 overflow-hidden hover:scale-105 transition-all duration-500 ease-out"
                >
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 rounded-lg p-[1px]">
                    <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 rounded-lg h-full w-full"></div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10 p-8">
                    <CardHeader className="pb-4 px-0">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 rounded-xl w-fit border border-amber-500/20">
                          <feature.icon className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-white transition-all duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-3xl"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section with green medical styling */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
                💰 Affordable Healthcare
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
                Consultation Packages
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                Choose the perfect consultation package that fits your healthcare needs
              </p>
            </div>
            <div className="mx-auto">
              {/* Clerk Pricing Table */}
              <Pricing />
            </div>
            <div className="mt-12">
              {/* Description */}
              <Card className="group relative bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border-0 overflow-hidden hover:scale-105 transition-all duration-500 ease-out max-w-4xl mx-auto">
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 rounded-lg p-[1px]">
                  <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 rounded-lg h-full w-full"></div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 p-8">
                  <CardHeader className="pb-6 px-0">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-white transition-all duration-300 flex items-center">
                      <div className="relative mr-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-3 rounded-xl border border-amber-500/20">
                          <Stethoscope className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                        </div>
                      </div>
                      How Our Credit System Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ul className="space-y-4">
                      {creditBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="relative mr-4 mt-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-2 rounded-full border border-amber-500/20">
                              <svg
                                className="h-4 w-4 text-amber-400 group-hover:text-amber-300 transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <p
                            className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300"
                            dangerouslySetInnerHTML={{ __html: benefit }}
                          />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-3xl"></div>
              </Card>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
                💬 Success Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
                What Our Users Say
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                Hear from patients and doctors who use our platform to transform their healthcare experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border-0 overflow-hidden hover:scale-105 transition-all duration-500 ease-out"
                >
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 rounded-lg p-[1px]">
                    <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 rounded-lg h-full w-full"></div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10 p-8">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-6">
                        <div className="relative mr-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
                            <span className="text-amber-400 font-bold text-lg group-hover:text-amber-300 transition-colors duration-300">
                              {testimonial.initials}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-white transition-all duration-300">
                            {testimonial.name}
                          </h4>
                          <p className="text-amber-400/70 text-sm font-medium">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -top-2 -left-2 text-4xl text-amber-500/20 font-serif">&quot;</div>
                        <p className="text-slate-300 leading-relaxed pl-6 group-hover:text-slate-200 transition-colors duration-300">
                          {testimonial.quote}
                        </p>
                        <div className="absolute -bottom-2 -right-2 text-4xl text-amber-500/20 font-serif rotate-180">&quot;</div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-3xl"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-3xl p-12 border border-amber-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-600/5"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
                  Ready to Transform Your Healthcare Experience?
                </h3>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied patients who have already discovered the convenience of modern healthcare.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 px-10 py-6 text-lg font-semibold shadow-2xl shadow-amber-500/25">
                  Start Your Journey
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
