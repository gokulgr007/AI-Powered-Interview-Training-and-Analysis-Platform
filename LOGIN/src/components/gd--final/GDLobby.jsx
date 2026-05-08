import { MessageCircle, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleStartDiscussion = () => {
    navigate('/group-discussion');
  };

  return (
    <div className="h-[calc(90vh-60px)] overflow-hidden px-6 pt-5">
  <div className="max-w-6xl mx-auto">

    {/* Header */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
        <MessageCircle className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Group Discussion Starter
      </h1>

      <p className="text-base text-gray-600 max-w-2xl mx-auto">
        Facilitate meaningful conversations through structured, collaborative group discussions.
      </p>
    </div>

    {/* Card */}
    <div className="rounded-3xl border border-indigo-100 bg-white shadow-md px-10 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <Feature
              icon={<Users />}
              title="Collaborative"
              text="Engage multiple participants"
            />
            <Feature
              icon={<Sparkles />}
              title="Structured"
              text="Organized discussion flow"
            />
            <Feature
              icon={<MessageCircle />}
              title="Interactive"
              text="Real-time engagement"
            />
      </div>

      <div className="flex justify-center">
            <button
              onClick={handleStartDiscussion}
              className="group inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md hover:scale-105"
            >
              Start Group Discussion
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
    </div>

  </div>
</div>

  );
}

/* Small helper component */
function Feature({ icon, title, text }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-lg mb-2 text-indigo-700">
        {icon}
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-500">{text}</p>
    </div>
  );
}

export default App;