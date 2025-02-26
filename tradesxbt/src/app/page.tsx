"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowRight, 
  Sparkles, 
  LineChart, 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  Brain, 
  Bot, 
  Layers, 
  Shield,
  Users
} from "lucide-react";
import AgentShowcase from "@/components/AgentShowcase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CryptoCard } from "@/components/ui/crypto-card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Features data for Blockswarms showcase
  const features = [
    {
      icon: <Brain className="h-12 w-12 mb-3 text-[#00FF80]" />,
      title: "Swarm Intelligence",
      description: "Multiple AI agents working in parallel to analyze market patterns and identify trading opportunities.",
    },
    {
      icon: <Layers className="h-12 w-12 mb-3 text-[#00FF80]" />,
      title: "Multi-strategy Approach",
      description: "Combines technical analysis, on-chain data, social sentiment, and fundamental indicators for comprehensive insights.",
    },
    {
      icon: <Bot className="h-12 w-12 mb-3 text-[#00FF80]" />,
      title: "Autonomous Trading",
      description: "Configure AI agents to execute trades automatically based on your risk preferences and strategy parameters.",
    },
    {
      icon: <Shield className="h-12 w-12 mb-3 text-[#00FF80]" />,
      title: "Advanced Risk Management",
      description: "Sophisticated protection mechanisms to safeguard your capital during volatile market conditions.",
    },
  ];
  
  // Mock pricing plans
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for beginners",
      features: [
        "Real-time market data",
        "Basic charting tools",
        "Limited AI signals",
        "Community access",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$49",
      description: "For serious traders",
      features: [
        "Everything in Basic",
        "Advanced AI signals",
        "Priority execution",
        "Portfolio analysis",
        "Custom alerts",
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For professional traders",
      features: [
        "Everything in Pro",
        "Custom API access",
        "Dedicated support",
        "Institutional tools",
        "Custom integrations",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  // UI state
  const [showAgents, setShowAgents] = useState(false);

  // Handle login for demo purposes
  const handleConnect = () => {
    localStorage.setItem("walletConnected", "true");
    router.push("/dashboard");
  };
  
  // Handle meeting the agents
  const handleMeetAgents = () => {
    // Scroll to the agents section
    const agentsSection = document.getElementById('meet-agents-section');
    if (agentsSection) {
      agentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    setMounted(true);
    
    // Check if already logged in
    const walletConnected = localStorage.getItem("walletConnected");
    if (walletConnected) {
      router.push("/dashboard");
    }
  }, [router]);
  
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.02] z-0 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-purple-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center">
                <span className="font-bold text-white">T</span>
              </div>
              <h1 className="text-xl font-bold">TradesXBT</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="glass" onClick={handleConnect}>
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="glow" className="mb-4">Powered by Gaply Labs</Badge>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#00FF80] via-blue-500 to-cyan-400">Blockswarms</span> <br />Trading Platform
              </h2>
              <p className="text-lg text-gray-300 max-w-xl">
                TradesXBT with Blockswarms deploys a swarm of specialized AI agents that work together to analyze the Solana ecosystem, identify opportunities, and execute trades with unparalleled precision.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button onClick={handleConnect} variant="glow" size="lg" className="text-md font-medium h-12">
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-md font-medium h-12 border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
                  onClick={handleMeetAgents}
                >
                  <Users size={16} className="mr-2" />
                  Meet the Agents
                </Button>
              </div>
              
              <div className="pt-6 flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF80]" />
                  <span className="text-gray-300">Swarm Intelligence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF80]" />
                  <span className="text-gray-300">Multi-Agent Technology</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF80]" />
                  <span className="text-gray-300">Gaply Labs Innovation</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-xl opacity-30"></div>
              <div className="relative bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-1 overflow-hidden">
                <div className="aspect-[5/3] rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                    <div className="text-center p-6">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      <h3 className="text-xl font-medium mb-2">AI Trading Dashboard</h3>
                      <p className="text-gray-400 text-sm">
                        Connect your wallet to access our trading dashboard
                      </p>
                      <Button onClick={handleConnect} variant="glow" className="mt-4">
                        Connect Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Blockswarms Technology</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Developed by Gaply Labs, Blockswarms deploys a swarm of specialized AI agents that collaborate to give you an edge in the volatile Solana market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <CryptoCard 
                key={index} 
                variant="glass" 
                hover="scale" 
                className="text-center p-6 sm:p-8"
              >
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </CryptoCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Meet the Agents Section */}
      <section id="meet-agents-section" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-black/50 to-black/70">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#00FF80]/10 backdrop-blur-sm border border-[#00FF80]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm font-medium flex items-center text-[#00FF80]">
                <Users size={14} className="mr-2" />
                Powered by Gaply Labs
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Blockswarms Agent Network</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              TradesXBT is the first agent in the Blockswarms network, with more agents coming soon from Gaply Labs. Click on any agent to learn more.
            </p>
          </div>
          
          {/* Agent Showcase Component */}
          <AgentShowcase />
          
          <div className="flex justify-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10 h-12 px-8 rounded-full"
              onClick={handleConnect}
            >
              Launch TradesXBT Agent
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the plan that suits your trading needs. All plans include core features with additional benefits as you upgrade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <CryptoCard 
                key={index} 
                variant={plan.popular ? "glow" : "glass"} 
                hover={plan.popular ? "both" : "scale"} 
                gradientOverlay={plan.popular}
                innerGlow={plan.popular ? "#6200EA" : undefined}
                className="p-6 sm:p-8 relative"
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Free" && plan.price !== "Custom" && (
                      <span className="text-gray-400 ml-1">/month</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                </div>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant={plan.popular ? "neon" : "outline"} 
                  className={`w-full ${plan.popular ? 'bg-[#00FF80]/20 hover:bg-[#00FF80]/30 text-[#00FF80] border-[#00FF80]/30' : ''}`}
                  onClick={handleConnect}
                >
                  {plan.buttonText}
                </Button>
              </CryptoCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <CryptoCard 
            variant="sol" 
            gradientOverlay 
            className="px-6 py-16 sm:p-16 text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Experience the power of <span className="text-[#00FF80]">Blockswarms</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of traders who are already using Blockswarms by Gaply Labs to navigate the volatile Solana market with precision and confidence.
              </p>
              <Button 
                variant="glow" 
                size="lg" 
                className="text-md font-medium h-12"
                onClick={handleConnect}
              >
                Launch Trading Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CryptoCard>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 sm:py-12 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center">
                  <span className="font-bold text-white">T</span>
                </div>
                <h1 className="text-xl font-bold">TradesXBT</h1>
              </div>
              <p className="text-gray-400 text-sm">
                Trading platform powered by Blockswarms technology. Developed by Gaply Labs.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TradesXBT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Define CSS for text gradient */}
      <style jsx global>{`
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(to right, #a78bfa, #60a5fa, #34d399);
        }
      `}</style>
    </div>
  );
}