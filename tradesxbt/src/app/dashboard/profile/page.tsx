import { currentUser } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile - TradesXBT",
  description: "Your TradesXBT profile",
};

export default async function ProfilePage() {
  const user = await currentUser();
  
  // Redirect if not logged in
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
        
        <div className="bg-[#0D0D0D] rounded-lg border border-gray-800 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Account Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-400">Email</dt>
                  <dd className="text-white">{user.emailAddresses[0]?.emailAddress}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">User ID</dt>
                  <dd className="text-white font-mono text-sm">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Account Created</dt>
                  <dd className="text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Settings</h3>
              <div className="space-y-4">
                <a 
                  href="/user/settings" 
                  className="block px-4 py-2 bg-[#151515] rounded border border-gray-700 text-white hover:bg-[#1c1c1c] transition"
                >
                  Account Settings
                </a>
                <a 
                  href="/api/auth/signout" 
                  className="block px-4 py-2 bg-red-900/20 rounded border border-red-900/50 text-red-400 hover:bg-red-900/30 transition"
                >
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}