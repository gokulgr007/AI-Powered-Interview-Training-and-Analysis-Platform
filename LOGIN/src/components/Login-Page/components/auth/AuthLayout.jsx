import { useEffect } from "react";
import { CheckCircle2, Users, Trophy } from "lucide-react";
export function AuthLayout({ children, title, subtitle, asModal = false, onClose, compact = false }) {
  const testimonialImages = [
  "https://randomuser.me/api/portraits/men/5.jpg",
  "https://randomuser.me/api/portraits/women/45.jpg",
  "https://randomuser.me/api/portraits/men/76.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
];
  // Modal variant: centered, blurred backdrop, compact card
    useEffect(() => {
      if (asModal) {
        document.body.classList.add('has-auth-modal');
        return () => document.body.classList.remove('has-auth-modal');
      }
    }, [asModal]);

    if (asModal) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center py-10">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if (onClose) onClose(); }} />
        <div className={`relative w-full max-w-[420px] mx-auto ${compact ? 'p-4' : 'p-8'} bg-white rounded-xl shadow-2xl`}>
          <div className={`${compact ? 'space-y-1' : 'space-y-3'} text-center`}>
            <h1 className={`${compact ? 'text-2xl' : 'text-3xl'} font-semibold tracking-tight text-gray-900`}>{title}</h1>
            <p className={`${compact ? 'text-xs text-gray-500' : 'text-sm text-muted-foreground'}`}>{subtitle}</p>
          </div>

          <div className="mt-5">{children}</div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => {
                  const img = testimonialImages[Math.floor(Math.random() * testimonialImages.length)];
                  return (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                      <img src={img} alt="Testimonial user" className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
              <p>Join 10,000+ candidates preparing today</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Auth Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-display">
              {title}
            </h1>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </div>
          
          {children}

          <div className="pt-8 mt-8 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => {
                  const img =
                    testimonialImages[
                      Math.floor(Math.random() * testimonialImages.length)
                    ];

                  return (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                    >
                      <img
                        src={img}
                        alt="Testimonial user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>

              <p>Join 10,000+ candidates preparing today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual / Marketing */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 opacity-[0.03] pattern-grid-lg"></div>
        
        <div className="relative z-10 max-w-lg mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-indigo-500/10 border border-indigo-50">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display text-gray-900">Master Your Tech Interviews</h2>
            <p className="text-gray-500 leading-relaxed">
              Our AI-powered platform helps you practice real-world scenarios, get instant feedback, and land your dream job at top tech companies.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium text-sm text-gray-700">Mock Interviews</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-sm text-gray-700">Peer Practice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


