import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - TradesXBT",
  description: "Log in to your TradesXBT account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 bg-[#050505]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">TradesXBT</h1>
          <p className="text-gray-400 mt-2">AI-powered Solana trading</p>
        </div>
        
        <div className="bg-[#0D0D0D] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white text-xl",
                headerSubtitle: "text-gray-400",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-[#151515] border-gray-700 text-white",
                footerActionLink: "text-blue-500 hover:text-blue-400",
                identityPreviewText: "text-gray-300",
                formFieldInputShowPasswordButton: "text-gray-400",
              },
            }}
            signUpUrl="/signup"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}